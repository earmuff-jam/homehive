import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TStripeRentPaymentSubmissionProps } from "features/Rent/Rent.types";
import { TCreateEmailPayload } from "src/types";

// TEsignFromTemplatePayload ...
// TODO: this is the same payload to send Esign document
// update it after we fix that.
export type TEsignFromTemplatePayload = Record<string, unknown>;

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

    // checkStripeAccountStatus ...
    // defines a builder mutation to check the account status
    checkStripeAccountStatus: builder.mutation<void, string>({
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
      TStripeRentPaymentSubmissionProps
    >({
      query: ({
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
      }) => ({
        method: "POST",
        url: "",
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
      }),
    }),
  }),
});

export const {
  useCreateEmailMutation,
  useCreateEsignFromTemplateMutation,
  useCheckStripeAccountStatusMutation,
  useGenerateStripeCheckoutSessionMutation,
} = externalIntegrationsApi;
