import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TagTypes = {
  SendEmail: "send-email",
  EsignTemplates: "esign-templates",
  EsignWorkspaces: "esign-workspaces",
  CheckStripeAccountStatus: "check-stripe-account-status",
  RecentStripeTransactions: "stripe-recent-transactions",
};

export const externalIntegrationsApi = createApi({
  reducerPath: "externalIntegrationsApi",
  tagTypes: Object.values(TagTypes),
  baseQuery: fetchBaseQuery({
    baseUrl: "/.netlify/functions/proxy",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // sendEmail ...
    // defines a mutation that sends email
    sendEmail: builder.mutation({
      query: ({ to, subject, text, html, ccEmailIds, bccEmailIds }) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0001_send_email_fn",
          fMethod: "POST",
          payload: { to, subject, text, html, ccEmailIds, bccEmailIds },
        }),
      }),
      providesTags: [TagTypes.SendEmail],
    }),
    // getWorkspaces ...
    // defines an mutation that returns a list of workspaces
    getWorkspaces: builder.mutation({
      query: () => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0013_fetch_esign_status",
          fMethod: "POST",
        }),
      }),
      providesTags: [TagTypes.EsignWorkspaces],
    }),
    // getEsignTemplates ...
    // defines a function that returns esign templates
    getEsignTemplates: builder.query({
      query: (userId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0015_fetch_esign_templates",
          fMethod: "POST",
          payload: userId,
        }),
      }),
      providesTags: [TagTypes.EsignTemplates],
    }),
    // createTemplate ...
    // defines a function that creates template
    createTemplate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0016_create_esign_template",
          fMethod: "POST",
          payload: data,
        }),
      }),
      invalidatesTags: [TagTypes.EsignTemplates],
    }),
    // deleteTemplate ...
    // defines a function that removes template
    deleteTemplate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0017_remove_esign_template",
          fMethod: "POST",
          payload: data,
        }),
      }),
      invalidatesTags: [TagTypes.EsignTemplates],
    }),
    // createEsignFromTemplate ...
    // defines a function that creates Esign documents from the template
    createEsignFromTemplate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0018_template_to_esign_document",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
    // checkStripeAccountStatus ...
    // defines a mutation that checks if the user has a valid stripe account
    checkStripeAccountStatus: builder.query({
      query: (accountId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0004_fetch_stripe_account_status",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
      providesTags: [TagTypes.CheckStripeAccountStatus],
    }),
    // createStripeAccount ...
    // defines a mutation that creates a stripe account
    createStripeAccount: builder.mutation({
      query: (email) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0002_create_stripe_account",
          fMethod: "POST",
          payload: { email },
        }),
      }),
      invalidatesTags: [TagTypes.CheckStripeAccountStatus],
    }),
    // createStripeAccountLink ...
    // defines a mutation that creates a stripe account
    createStripeAccountLink: builder.mutation({
      query: (accountId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0003_link_stripe_account",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
      invalidatesTags: [TagTypes.CheckStripeAccountStatus],
    }),
    // createSecureStripeLoginLink ...
    // defines a mutation that creates a stripe account
    createSecureStripeLoginLink: builder.mutation({
      query: (accountId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0005_fetch_stripe_bank_login_link",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
      invalidatesTags: [TagTypes.CheckStripeAccountStatus],
    }),
    // getRecentTransactions ...
    // defines a query that retrieves recent transactions made under stripe
    getRecentTransactions: builder.query({
      query: (connectedAccountId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0006_fetch_stripe_recent_transactions",
          fMethod: "POST",
          payload: { connectedAccountId },
        }),
      }),
      providesTags: [TagTypes.RecentStripeTransactions],
    }),
    // createStripeCustomerLinkMutation ...
    // defines a function that creates stripe customer for subscription
    createStripeCustomerLink: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0021_create_stripe_customer_link",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
    // getSubscriptionOptions ...
    // defines a mutation that checks if the user has a valid stripe account
    getSubscriptionOptions: builder.query({
      query: () => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0022_retrieve_subscriptions_options",
          fMethod: "POST",
        }),
      }),
      providesTags: [TagTypes.CheckStripeAccountStatus],
    }),
  }),
});

export const {
  useSendEmailMutation,
  useGetEsignTemplatesQuery,
  useGetWorkspacesMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useCreateEsignFromTemplateMutation,
  useCheckStripeAccountStatusQuery,
  useCreateStripeAccountMutation,
  useCreateStripeAccountLinkMutation,
  useCreateSecureStripeLoginLinkMutation,
  useGetRecentTransactionsQuery,
  useCreateStripeCustomerLinkMutation,
  useGetSubscriptionOptionsQuery,
} = externalIntegrationsApi;
