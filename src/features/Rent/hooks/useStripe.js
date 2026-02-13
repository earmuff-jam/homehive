import { useState } from "react";

// useCreateStripeAccount ...
// defines a function which provides the ability to create new stripe account
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
      const response = await fetch("/.netlify/functions/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fUrl: "0002_create_stripe_account",
          fMethod: "POST",
          payload: { email },
        }),
      });

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

// useCreateStripeAccountLink ...
// defines a function that is used to create stripe account assocation securely
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
      const response = await fetch("/.netlify/functions/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fUrl: "0003_link_stripe_account",
          fMethod: "POST",
          payload: { accountId },
        }),
      });

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

// useCreateLoginLinkStripeAccount ...
// defines a function which is used to create a login link for stripe account
export const useCreateLoginLinkStripeAccount = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createStripeLoginLink = async ({ accountId }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/.netlify/functions/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fUrl: "0005_fetch_stripe_bank_login_link",
          fMethod: "POST",
          payload: { accountId },
        }),
      });

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

// useGetRecentTransactions ...
// defines a function that is used to retrieve recent transactions
export const useGetRecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async ({ connectedAccountId }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/.netlify/functions/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fUrl: "0006_fetch_stripe_recent_transactions",
          fMethod: "POST",
          payload: { connectedAccountId },
        }),
      });

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
