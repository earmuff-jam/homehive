/**
 * File : 0002_connect_stripe_account.js
 *
 * This file is used to connect to a stripe account.
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
 * handler fn to handle the passed in property owner configuration
 * for secure payment processing from the tenants
 *
 * @param {Object} event - The event payload passed from Netlify function
 */
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email,
      capabilities: {
        card_payments: { requested: true }, // credit / debit cards
        transfers: { requested: true },
        us_bank_account_ach_payments: { requested: true }, // ach
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ accountId: account.id }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message || "An error occurred while creating the account",
      }),
    };
  }
};
