/**
 * File : 0009_fetch_stripe_payment_confirmation.js
 *
 * This file is used to confirm payments
 *
 * Must have feature flags enabled for this feature.
 */
import Stripe from "stripe";

const stripe = new Stripe(process.env.VITE_AUTH_STRIPE_CONNECTION_SECRET_KEY, {
  apiVersion: process.env.VITE_AUTH_STRIPE_CONNECTION_API_VERSION,
});

/**
 * handler fn
 *
 * handler fn to create a checkout session
 *
 * @param {Object} event - The event payload passed
 */
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { userId, sessionId, stripeAccountId } = JSON.parse(event.body);

    if ( !userId || !sessionId || !stripeAccountId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["payment_intent"] },
      { stripeAccount: stripeAccountId },
    );

    const paymentIntent = session.payment_intent;

    if (!paymentIntent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No payment intent found" }),
      };
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method,
      { stripeAccount: stripeAccountId },
    );

    let paymentMethodDescription;
    if (paymentMethod.type === "card") {
      paymentMethodDescription = `${paymentMethod.card.brand.toUpperCase()} ${paymentMethod.card.funding.toUpperCase()} CARD`;
    } else if (paymentMethod.type === "us_bank_account") {
      paymentMethodDescription = `US BANK ACCOUNT (${paymentMethod.us_bank_account.bank_name || "Unknown Bank"})`;
    } else {
      paymentMethodDescription = paymentMethod.type.toUpperCase();
    }

    if (
      session?.payment_status === "paid" ||
      paymentIntent.status === "succeeded"
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          session: session,
          paymentMethod: paymentMethodDescription,
        }),
      };
    }

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: paymentIntent?.status || "unknown",
          message: "Payment not yet completed",
          session: session,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: paymentIntent.status,
        paymentMethod: paymentMethodDescription,
        message: "Payment not yet completed",
      }),
    };
  } catch (error) {
    console.error("Error confirming payment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
