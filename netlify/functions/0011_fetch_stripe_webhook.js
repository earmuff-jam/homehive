/**
 * File : 0011_fetch_stripe_webhook.js
 *
 * This file is used to fetch data from stripe when the event loop
 * is completed in stripe.
 *
 * Must have feature flags enabled for this feature.
 */
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    // Verify signature with your webhook secret from Stripe Dashboard
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
