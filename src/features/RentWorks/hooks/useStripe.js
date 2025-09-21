import { useState } from "react";

/**
 * useCreateStripeAccount
 *
 * Hook to create a Stripe connected account via Netlify function
 * @returns createAccount function, loading state, error state, success state
 */
export const useCreateStripeAccount = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const createAccount = async ({ email }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        "/.netlify/functions/0002_create_stripe_account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Unable to create account");

      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAccount, reset, loading, error, success };
};

/**
 * useCreateStripeAccountLink
 *
 * Hook to create a Stripe onboarding link for a connected account
 * @returns createAccountLink function, loading state, error state, success state
 */
export const useCreateStripeAccountLink = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const createAccountLink = async ({ accountId }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!accountId) {
      throw new Error("Unable to create account link");
    }

    try {
      const response = await fetch(
        "/.netlify/functions/0003_link_stripe_account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId }),
        },
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Unable to create account link");

      setSuccess(true);
      return data.url; // URL to redirect user to
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAccountLink, reset, loading, error, success };
};

/**
 * useCreateLoginLinkStripeAccount ...
 *
 * Hook to generate a Stripe dashboard login link and redirect the user.
 */
export const useCreateLoginLinkStripeAccount = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createStripeLoginLink = async ({ accountId }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/.netlify/functions/0005_fetch_stripe_bank_login_link",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId }),
        },
      );

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to generate Stripe login link");
      }

      return data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createStripeLoginLink, loading, error };
};

/**
 * useGetRecentTransactions ...
 *
 * Hook to fetch the recent transactions based on the account Id
 */
export const useGetRecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async ({ connectedAccountId }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/.netlify/functions/0006_fetch_stripe_recent_transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ connectedAccountId }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { transactions, fetchTransactions, loading, error };
};