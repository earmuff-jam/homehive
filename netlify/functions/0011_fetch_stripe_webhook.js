/**
 * File : 0011_fetch_stripe_webhook.js
 *
 * This file is used to fetch data from stripe when the event loop
 * is completed in stripe. This functionality is used by stripe to support
 * XX event after an activity in stripe has been completed. Eg, if a payment is
 * moved from pending to paid, then the webhook should be called by stripe to
 * mark the payment complete in db.
 *
 * Must have feature flags enabled for this feature.
 */
import dayjs from "dayjs";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_WEBHOOK_KEY);

/**
 * handler fn
 *
 * used to retrive and update db based on stripe webhook responses.
 *
 * @param {Object} event - the event payload to be processed.
 */
export const handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // handle charge code associations
  updateStripePaymentHandler(stripeEvent?.type, stripeEvent?.data?.object);

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};

/**
 * updateStripePaymentHandler ...
 *
 * function used to update stripe payment services based on various associations
 * made by stripe payment services.
 *
 * @param {string} stripeEventType - the type of event that we need to process.
 * @param {Object} eventDetails - the event details object
 */
const updateStripePaymentHandler = (stripeEventType, eventDetails) => {
  switch (stripeEventType) {
    // Payment Intents
    case "payment_intent.created":
      console.info(
        "Submitted stripe payment services for payment intent with created stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.id,
        amount: eventDetails?.amount,
        status: eventDetails?.status,
      });
      break;
    case "payment_intent.processing":
      console.info(
        "Submitted stripe payment services for payment intent with processing stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.id,
        amount: eventDetails?.amount,
        status: eventDetails?.status,
      });
      break;
    case "payment_intent.succeeded":
      console.info(
        "Submitted stripe payment services for payment intent with success stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.id,
        amount: eventDetails?.amount,
        status: eventDetails?.status,
      });
      break;

    // Checkout Session events
    case "checkout.session.completed":
      console.info(
        "Submitted stripe payment services for checkout session intent with completed stamp.",
      );
      updateDb(stripeEventType, eventDetails);
      break;
    case "checkout.session.async_payment_succeeded":
      console.info(
        "Submitted async stripe payment services for payment intent with success stamp.",
      );
      updateDb(stripeEventType, eventDetails);
      break;
    case "checkout.session.async_payment_failed":
      console.info(
        "Submitted async stripe payment services for payment intent with failure stamp.",
      );
      updateDb(stripeEventType, eventDetails);
      break;

    // Charge events
    case "charge.failed":
      console.info(
        "Submitted stripe payment services for charge intent with failed stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.payment_intent, // payment_intent is unique accessor
        amount: eventDetails?.amount,
        status: eventDetails?.status,
        paymentMethod: eventDetails?.payment_method,
        paymentMethodDetails: eventDetails?.payment_method_details,
      });
      break;
    case "charge.pending":
      console.info(
        "Submitted stripe payment services for charge intent with pending stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.payment_intent, // payment_intent is unique accessor
        amount: eventDetails?.amount,
        status: eventDetails?.status,
        paymentMethod: eventDetails?.payment_method,
        paymentMethodDetails: eventDetails?.payment_method_details,
      });
      break;
    case "charge.succeeded":
      console.info(
        "Submitted stripe payment services for charge intent with success stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.payment_intent, // payment_intent is unique accessor
        amount: eventDetails?.amount,
        status: eventDetails?.status,
        paymentMethod: eventDetails?.payment_method,
        paymentMethodDetails: eventDetails?.payment_method_details,
        recieptURL: eventDetails?.receipt_url,
      });
      break;
    case "charge.updated":
      console.info(
        "Submitted stripe payment services for charge intent with updated stamp.",
      );
      updateDb(stripeEventType, {
        id: eventDetails?.payment_intent, // payment_intent is unique accessor
        amount: eventDetails?.amount,
        status: eventDetails?.status,
        paymentMethod: eventDetails?.payment_method,
        paymentMethodDetails: eventDetails?.payment_method_details,
      });
      break;
    // Default
    default:
      /* eslint-disable no-console */
      console.log("No matching case for event type:", stripeEventType);
      break;
  }
};

/**
 * updateDb ...
 *
 * used to update the db for rent payment webhook handler.
 *
 * @param {Object} data - the data to post into the db.
 * @param {string} stripeEventType - the type of event that we need to process.
 *
 * @returns {Boolean} truthly of falsy value
 */
const updateDb = async (stripeEventType, data) => {
  if (
    !stripeEventType ||
    typeof data !== "object" ||
    Object.keys(data).length === 0
  ) {
    console.error("unable to update data. missing required fields.");
    return null;
  }

  try {
    // handle events with session metadata differently
    if (data?.metadata) {
      const {
        propertyId,
        propertyOwnerId,
        customer_email: tenantEmail,
        rentAmount,
        additionalCharges,
        initialLateFee,
        dailyLateFee,
        rentMonth,
        tenantId,
      } = data?.metadata;

      const stripePaymentIntentID = data?.payment_intent;

      const draftData = {
        tenantId,
        tenantEmail,
        propertyId,
        propertyOwnerId,
        rentMonth,
        rentAmount,
        additionalCharges,
        initialLateFee,
        dailyLateFee,
        stripePaymentIntentID,
        method: "stripe",
        status: data.status,
        stripeEventType,
        paymentMethodType: Object.keys(data.payment_method_options)[0],
        createdBy: tenantId, // tenant is the only one who can pay
        createdOn: dayjs().toISOString(),
        updatedBy: tenantId,
        updatedOn: dayjs().toISOString(),
      };
      const response = await fetch(
        `${process.env.SITE_URL}/.netlify/functions/0012_update_stripe_payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftData),
        },
      );

      if (!response.ok) {
        console.error("failed to update db.");
        throw new Error(`Failed to update DB: ${response.statusText}`);
      }

      return true;
    } else {
      const draftData = {
        stripePaymentIntentID: data.id,
        method: "stripe",
        status: data.status,
        amount: data.amount,
        stripeEventType,
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().toISOString(),
      };
      const response = await fetch(
        `${process.env.SITE_URL}/.netlify/functions/0012_update_stripe_payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftData),
        },
      );

      if (!response.ok) {
        console.error("failed to update db.");
        throw new Error(`Failed to update DB: ${response.statusText}`);
      }

      return false;
    }
  } catch (err) {
    console.error("updateDb error:", err);
    return false;
  }
};
