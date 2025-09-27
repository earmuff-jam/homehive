/**
 * File : 0003_link_stripe_account.js
 *
 * This file is used to link stripe account to a user.
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
 * handler fn to handle the link between stripe and a user
 *
 * @param {Object} event - The event payload passed
 */
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { accountId } = JSON.parse(event.body);

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.VITE_AUTH_STRIPE_RETURN_URL,
      return_url: process.env.VITE_AUTH_STRIPE_REFRESH_URL,
      type: "account_onboarding",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: accountLink.url }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
