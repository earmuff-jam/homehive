/**
 * File : 0010_send_automatic_reminders.js
 *
 * This file is used to send automatic reminders via email
 * using Automatic Payment Reminder System (ARPS). Uses admin
 * rights and privilidges. Requires .env variables to properly
 * processed in the system.
 *
 * Must have feature flags enabled for this feature.
 */
import dayjs from "dayjs";

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const isLocalDevTestEnv = process.env.VITE_DEVELOPMENT_ENV;

if (isLocalDevTestEnv) {
  if (!admin.apps.length) {
    const serviceAccountPath = path.resolve("./dev/account.json");
    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8"),
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
} else {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.VITE_FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
  }
}

const db = admin.firestore();
const AdminAuthorizedKey = process.env.VITE_SITE_ADMIN_AUTHORIZED_KEY;

const standardReminderSettings = {
  GENERAL: [7, 3, 1, 0],
};

/**
 * handler fn ...
 *
 * used to retrieve rental payments and associated property. Function
 * attempts to send email to associated rentees if exists.
 *
 * @param {Object} event - the event payload to be processed.
 */
export const handler = async (event) => {
  if (
    !isLocalDevTestEnv &&
    event.queryStringParameters?.key !== AdminAuthorizedKey
  ) {
    console.error("problem fetching required token");
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const today = dayjs();
    const emailPromises = [];
    const reminders = standardReminderSettings.GENERAL;

    // Fetch all active tenants
    const tenantsSnapshot = await db
      .collection("tenants")
      .where("isActive", "==", true)
      .get();

    for (const tenantDoc of tenantsSnapshot.docs) {
      const tenantData = tenantDoc.data();
      const propertyId = tenantData?.propertyId;

      // Fetch property for tenant
      const propertySnapshot = await db
        .collection("properties")
        .where("isDeleted", "==", false)
        .where("id", "==", propertyId)
        .where("rentees", "array-contains", tenantData.email)
        .limit(1)
        .get();

      const propertyDoc = propertySnapshot.docs[0];
      if (!propertyDoc) {
        console.error(
          "problem retrieving selected property. unable to send automatic emails with required property details",
        );
        throw new Error("unable to find selected property");
      }

      const propertyData = propertyDoc.data();
      const currentMonth = today.format("MMMM");

      // Fetch rent for current month
      const rentSnapshot = await db
        .collection("rents")
        .where("propertyId", "==", propertyId)
        .where("rentMonth", "==", currentMonth)
        .get();

      let subject = "";
      let text = "";

      if (rentSnapshot.empty) {
        const dueDate = dayjs(tenantData?.start_date);
        const diffDays = dueDate.diff(today, "day");

        if (reminders.includes(diffDays)) {
          const totalAmount =
            Number(propertyData?.rent || 0) +
            Number(propertyData?.additional_rent || 0);
          subject = `Rent Reminder: Due in ${diffDays} day(s)`;
          text = `Hi ${tenantData.email}, your rent of $${totalAmount.toFixed(2)} is due on ${dueDate.format("MMMM D, YYYY")}. Please pay on time to avoid late fees.`;
        }
      } else {
        // Rent entry exists; tenant has already submitted rent amount
        const rentDoc = rentSnapshot.docs[0];
        const rentData = rentDoc.data();
        const rentDate = rentData.rentDueDate?.toDate
          ? dayjs(rentData.rentDueDate.toDate())
          : dayjs(rentData.rentDueDate);
        const diffDays = rentDate.diff(today, "day");

        if (reminders.includes(diffDays) && rentData.status !== "paid") {
          const totalAmount =
            (Number(rentData.rentAmount || 0) +
              Number(rentData.additionalCharges || 0) +
              Number(rentData.initialLateFee || 0) +
              Number(rentData.dailyLateFee || 0)) /
            100;

          subject = `Rent Reminder: Due in ${diffDays} day(s)`;
          text = `Hi, your rent of $${totalAmount.toFixed(2)} is due on ${rentDate.format("MMMM D, YYYY")}. Please pay on time to avoid late fees.`;
        }
      }

      if (subject && text) {
        emailPromises.push(
          fetch(
            `${process.env.VITE_SITE_URL}/.netlify/functions/0001_send_email_fn`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: tenantData.email,
                subject,
                text,
              }),
            },
          ),
        );
      }
    }

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`Email ${index} sent successfully`, result.value);
      } else {
        console.error(`Email ${index} failed`, result.reason);
      }
    });

    return {
      statusCode: 200,
      body: `Processed ${tenantsSnapshot.size} tenants, sent ${emailPromises.length} reminders.`,
    };
  } catch (error) {
    console.error("Error sending reminders:", error);
    return { statusCode: 500, body: `Error: ${error.message}` };
  }
};
