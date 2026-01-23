import { useState } from "react";

// useGenerateStripeCheckoutSession ...
// defines a function that generates secure stripe checkout session
export const useGenerateStripeCheckoutSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateStripeCheckoutSession = async ({
    rentAmount,
    additionalCharges,
    initialLateFee,
    dailyLateFee,
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
      const response = await fetch("/.netlify/functions/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fUrl: "0007_create_stripe_checkout_session",
          fMethod: "POST",
          payload: {
            rentAmount,
            additionalCharges,
            initialLateFee,
            dailyLateFee,
            stripeOwnerAccountId,
            propertyId,
            propertyOwnerId,
            tenantId,
            rentMonth,
            tenantEmail,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Unable to create Stripe checkout session",
        );
      }

      return data;
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
