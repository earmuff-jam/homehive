/**
 * File : 0006_fetch_stripe_recent_transactions.js
 *
 * This file is used to allow property owners and tenants to view their recent trasactions
 * safely.
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
 * handler fn to retrieve recent transaction details from stripe
 *
 * @param {Object} event - The event payload passed
 */
export const handler = async (event) => {};
