import { useState } from "react";

// useCheckStripeAccountStatus ...
// defines a function which returns the stripe account status if exists
export const useCheckStripeAccountStatus = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const checkStatus = async ({ accountId }) => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/.netlify/functions/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fUrl: "0004_fetch_stripe_account_status",
          fMethod: "POST",
          payload: { accountId },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch status");

      setStatus(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkStatus, loading, status, error };
};
