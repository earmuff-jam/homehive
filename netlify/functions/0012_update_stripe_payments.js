/**
 * File : 0012_update_stripe_payments.js
 *
 * This file is used to update the database with new stripe payment information once the payment has been completed. This is an automatic process that uses the webhook workflow to update database
 *
 * Must have feature flags enabled for this feature.
 */
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
      credential: admin.credential.cert(
        JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT),
      ),
    });
  }
}

const db = admin.firestore();
const AdminAuthorizedKey = process.env.VITE_SITE_ADMIN_AUTHORIZED_KEY;

/**
 * handler fn ...
 *
 * used to retrieve rental payments and associated property. Function
 * attempts to send email to associated rentees if exists.
 *
 * if the "createdBy" column exists, we assume that the webhook request
 * contained metadata which needs to be stored and processed differently.
 * this allows us to have idempotency over rental payments that are marked
 * as complete vs payments that are not fully completed.
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
    const data = JSON.parse(event.body);
    const containsMetadata = Boolean(data?.createdBy);

    let draftCollection = "rentalPayments";
    if (containsMetadata) {
      draftCollection = "rents";
    }
    const docRef = db
      .collection(draftCollection)
      .doc(data.stripePaymentIntentID);
    await docRef.set(data, { merge: true });

    // TODO: send email to clients
    if (containsMetadata) {
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: docRef.id }),
    };
  } catch (err) {
    console.error(
      "error updating the database with rent details from webhook handler. ",
      err,
    );
    throw err;
  }

};
