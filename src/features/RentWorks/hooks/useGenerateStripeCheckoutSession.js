import { useState } from "react";

/**
 * useGenerateStripeCheckoutSession ...
 *
 * fn used to generate secure stripe checkout session
 *
 * @returns
 */
export const useGenerateStripeCheckoutSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStripeCheckoutSession = async ({
    amount,
    stripeOwnerAccountId,
    propertyId,
    propertyOwnerId,
    tenantId,
    rentMonth,
    tenantEmail,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/.netlify/functions/0007_create_stripe_checkout_session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            stripeOwnerAccountId,
            propertyId,
            propertyOwnerId,
            tenantId,
            rentMonth,
            tenantEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Unable to create Stripe checkout session",
        );
      }

      return data.url;
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { generateStripeCheckoutSession, loading, error };
};
