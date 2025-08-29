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
import Stripe from "stripe";

const stripe = new Stripe(process.env.VITE_AUTH_STRIPE_SECRET_KEY);

/**
 * handler fn
 *
 * used to retrive and update db based on stripe webhook responses.
 * @param {*} event
 */
export const handler = async (event) => {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.VITE_AUTH_STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle only charge succeeded for now
  if (stripeEvent.type === "charge.succeeded") {
    const charge = stripeEvent.data.object;
    console.log("✅ Charge succeeded:", charge.id, charge.amount / 100);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
