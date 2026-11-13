import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ExternalIntegrationsApiTagTypes ...
const ExternalIntegrationsApiTagTypes = {
  SendEmail: "send-email",
  EsignTemplates: "esign-templates",
  EsignWorkspaces: "esign-workspaces",
  CheckStripeAccountStatus: "check-stripe-account-status",
  RecentStripeTransactions: "stripe-recent-transactions",
};

export const externalIntegrationsApi = createApi({
  reducerPath: "externalIntegrationsApi",
  tagTypes: Object.values(ExternalIntegrationsApiTagTypes),
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
          fUrl: "0001_SendCustomEmail",
          fMethod: "POST",
          payload: { to, subject, text, html, ccEmailIds, bccEmailIds },
        }),
      }),
      providesTags: [ExternalIntegrationsApiTagTypes.SendEmail],
    }),
    // getWorkspaces ...
    // defines an mutation that returns a list of workspaces
    getWorkspaces: builder.mutation({
      query: () => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0013_FetchEsignStatus",
          fMethod: "POST",
        }),
      }),
      providesTags: [ExternalIntegrationsApiTagTypes.EsignWorkspaces],
    }),
    // getEsignTemplates ...
    // defines a function that returns esign templates
    getEsignTemplates: builder.query({
      query: (userId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0015_FetchEsignTemplates",
          fMethod: "POST",
          payload: userId,
        }),
      }),
      providesTags: [ExternalIntegrationsApiTagTypes.EsignTemplates],
    }),
    // createTemplate ...
    // defines a function that creates template
    createTemplate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0016_CreateEsignTemplate",
          fMethod: "POST",
          payload: data,
        }),
      }),
      invalidatesTags: [ExternalIntegrationsApiTagTypes.EsignTemplates],
    }),
    // deleteTemplate ...
    // defines a function that removes template
    deleteTemplate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0017_RemoveEsignTemplate",
          fMethod: "POST",
          payload: data,
        }),
      }),
      invalidatesTags: [ExternalIntegrationsApiTagTypes.EsignTemplates],
    }),
    // createEsignFromTemplate ...
    // defines a function that creates Esign documents from the template
    createEsignFromTemplate: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0018_ConvertTemplateToEsign",
          fMethod: "POST",
          payload: data,
        }),
      }),
      invalidatesTags: [
        ExternalIntegrationsApiTagTypes.EsignTemplates,
        ExternalIntegrationsApiTagTypes.EsignWorkspaces,
      ],
    }),
    // checkStripeAccountStatus ...
    // defines a mutation that checks if the user has a valid stripe account
    checkStripeAccountStatus: builder.query({
      query: (accountId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0004_FetchStripeAccountStatus",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
      providesTags: [ExternalIntegrationsApiTagTypes.CheckStripeAccountStatus],
    }),
    // createStripeAccount ...
    // defines a mutation that creates a stripe account
    createStripeAccount: builder.mutation({
      query: (email) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0002_CreateStripeAccount",
          fMethod: "POST",
          payload: email,
        }),
      }),
      invalidatesTags: [
        ExternalIntegrationsApiTagTypes.CheckStripeAccountStatus,
      ],
    }),
    // createStripeAccountLink ...
    // defines a mutation that creates a stripe account
    createStripeAccountLink: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0003_LinkStripeAccount",
          fMethod: "POST",
          payload: data,
        }),
      }),
      invalidatesTags: [
        ExternalIntegrationsApiTagTypes.CheckStripeAccountStatus,
      ],
    }),
    // createSecureStripeLoginLink ...
    // defines a mutation that creates a stripe account
    createSecureStripeLoginLink: builder.mutation({
      query: (accountId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0005_FetchStripeBankLoginLink",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
      invalidatesTags: [
        ExternalIntegrationsApiTagTypes.CheckStripeAccountStatus,
      ],
    }),
    // getRecentTransactions ...
    // defines a query that retrieves recent transactions made under stripe
    getRecentTransactions: builder.query({
      query: ({ userId, stripeAccountId }) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0006_FetchRecentStripeTransactions",
          fMethod: "POST",
          payload: { userId, stripeAccountId },
        }),
      }),
      providesTags: [ExternalIntegrationsApiTagTypes.RecentStripeTransactions],
    }),
    // createStripeCustomerLink ...
    // defines a function that creates stripe customer for subscription
    createStripeCustomerLink: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0021_CreateStripeCustomerLink",
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
          fUrl: "0022_RetrieveSubscriptionOptions",
          fMethod: "POST",
        }),
      }),
      providesTags: [ExternalIntegrationsApiTagTypes.CheckStripeAccountStatus],
    }),
    // createStripeManageSubscriptionLink ...
    // defines a function that creates stripe link for subscription
    createStripeManageSubscriptionLink: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0025_ManageStripeSubscriptionLink",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
    // addressOneTimePayment ...
    // defines a function that allows property owners to send one time payment
    addressOneTimePayment: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0028_AddressOnetimePayment",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
    // purchaseTokenCheckoutSession ...
    // defines a function that allows users to checkout to stripe to purchase token for electronic signature
    purchaseTokenCheckoutSession: builder.mutation({
      query: (data) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0030_PurchaseEsignToken",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),
  }),
});

export const {
  useSendEmailMutation,
  useGetEsignTemplatesQuery,
  useGetWorkspacesMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useAddressOneTimePaymentMutation,
  useCreateEsignFromTemplateMutation,
  useCheckStripeAccountStatusQuery,
  useCreateStripeAccountMutation,
  useCreateStripeAccountLinkMutation,
  useCreateSecureStripeLoginLinkMutation,
  useGetRecentTransactionsQuery,
  useCreateStripeCustomerLinkMutation,
  useGetSubscriptionOptionsQuery,
  usePurchaseTokenCheckoutSessionMutation,
  useCreateStripeManageSubscriptionLinkMutation,
} = externalIntegrationsApi;
