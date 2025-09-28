/**
 * File : 0004_fetch_stripe_account_status.js
 *
 * This file is used to verify a users account status in stripe
 *
 * Must have feature flags enabled for this feature.
 */
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: process.env.STRIPE_API_VERSION,
});

/**
 * handler fn
 *
 * handler fn to retrieve account details from stripe
 *
 * @param {Object} event - The event payload passed
 */
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { accountId } = JSON.parse(event.body);
    const account = await stripe.accounts.retrieve(accountId, {
      expand: ["external_accounts"],
    });

    const status = {
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    };

    const bank = account.external_accounts?.data?.find(
      (acc) => acc.object === "bank_account",
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: status,
        bankAccount: bank
          ? {
              stripeAccountHolderLastFour: bank.last4,
              bank_name: bank.bank_name,
              currency: bank.currency,
              stripeAccountType: bank?.account_holder_type,
              stripeAccountHolderName: bank.account_holder_name,
              stripeRoutingNumber: bank.routing_number,
              stripeBankAccountName: bank?.bank_name,
              stripeBankAccountCountry: bank?.country,
              stripeBankAccountCurrencyMode: bank?.currency,
            }
          : null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
