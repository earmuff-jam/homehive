import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TCheckStripeAccountStatusRequest,
  TCreateEmailPayload,
  TCreateStripeAccountLinkRequest,
  TCreateStripeAccountResponse,
  TCreateWorkspaceRequest,
  TCreateWorkspaceResponse,
  TEsignFromTemplatePayload,
  TStripeRentPaymentSubmissionRequest,
} from "features/Api/types";

export const externalIntegrationsApi = createApi({
  reducerPath: "externalIntegrationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/.netlify/functions/proxy",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // createEmail ...
    // defines a builder mutation to send emails to clients
    createEmail: builder.mutation<void, TCreateEmailPayload>({
      query: (payload) => ({
        method: "POST",
        url: "",
        body: JSON.stringify({
          fUrl: "0013_fetch_esign_status",
          fMethod: "POST",
          payload: payload,
        }),
      }),
    }),

    // getEsignTemplates ...
    // defines a builder mutation to retrieve esign templates
    // TODO: update the request response params. I think everything would be better with just proper names so other people can also reference it/ its already too difficult for the likes of it. Lets add Request and Response as well. Can be a tech debt ticket.
    getEsignTemplates: builder.mutation<string[], string>({
      query: (userId) => ({
        method: "POST",
        url: "",
        body: {
          fUrl: "0015_fetch_esign_templates",
          fMethod: "POST",
          payload: userId,
        },
      }),
    }),

    // createWorkspace ...
    // defines a builder mutation to provide the ability to create a new workspace
    createWorkspace: builder.mutation<
      TCreateWorkspaceResponse,
      TCreateWorkspaceRequest
    >({
      query: (workspaceId) => ({
        url: "",
        method: "POST",
        body: JSON.stringify({
          fUrl: "0014_create_esign_workspace",
          fMethod: "POST",
          payload: workspaceId,
        }),
      }),
    }),

    // createEsignFromTemplate ...
    // defines a builder mutation to send Esign document from an existing template
    createEsignFromTemplate: builder.mutation<void, TEsignFromTemplatePayload>({
      query: (data) => ({
        method: "POST",
        url: "",
        body: JSON.stringify({
          fUrl: "0018_template_to_esign_document",
          fMethod: "POST",
          payload: data,
        }),
      }),
    }),

    // createStripeAccount ...
    // defines a function that is used to create a stripe account
    createStripeAccount: builder.mutation<TCreateStripeAccountResponse, string>(
      {
        query: (email) => ({
          url: "",
          method: "POST",
          body: JSON.stringify({
            fUrl: "0002_create_stripe_account",
            fMethod: "POST",
            payload: { email },
          }),
        }),
      },
    ),

    // createStripeAccountLink ...
    // defines a function that is used to create a stripe account link
    createStripeAccountLink: builder.mutation<
      string,
      TCreateStripeAccountLinkRequest
    >({
      query: (accountId) => ({
        url: "",
        method: "POST",
        body: JSON.stringify({
          fUrl: "0003_link_stripe_account",
          fMethod: "POST",
          payload: { accountId },
        }),
        transformResponse: (response: { url: string }) => response.url,
      }),
    }),

    // createStripeLoginLink ...
    // defines a builder mutation to create a secure login link
    // used to update or modify stripe details
    createStripeLoginLink: builder.mutation<
      string,
      TCreateStripeAccountLinkRequest
    >({
      query: (accountId) => ({
        url: "",
        method: "POST",
        body: JSON.stringify({
          fUrl: "0005_fetch_stripe_bank_login_link",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
    }),

    // checkStripeAccountStatus ...
    // defines a builder mutation to check the account status
    checkStripeAccountStatus: builder.mutation<
      void,
      TCheckStripeAccountStatusRequest
    >({
      query: (accountId) => ({
        method: "POST",
        url: "",
        body: JSON.stringify({
          fUrl: "0004_fetch_stripe_account_status",
          fMethod: "POST",
          payload: { accountId },
        }),
      }),
    }),

    // generateStripeCheckoutSession ...
    // defines a builder mutation to create a secure stripe checkout session
    generateStripeCheckoutSession: builder.mutation<
      void,
      TStripeRentPaymentSubmissionRequest
    >({
      query: ({
        rent,
        additionalCharges,
        initialLateFee,
        dailyLateFee,
        stripeOwnerAccountId,
        propertyId,
        propertyOwnerId,
        tenantId,
        rentMonth,
        tenantEmail,
      }) => ({
        method: "POST",
        url: "",
        body: JSON.stringify({
          fUrl: "0007_create_stripe_checkout_session",
          fMethod: "POST",
          payload: {
            rentAmount: rent,
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
      }),
    }),
  }),
});

export const {
  useCreateEmailMutation,
  useCreateWorkspaceMutation,
  useCreateStripeAccountMutation,
  useCreateStripeAccountLinkMutation,
  useCreateStripeLoginLinkMutation,
  useGetEsignTemplatesMutation,
  useCreateEsignFromTemplateMutation,
  useCheckStripeAccountStatusMutation,
  useGenerateStripeCheckoutSessionMutation,
} = externalIntegrationsApi;
