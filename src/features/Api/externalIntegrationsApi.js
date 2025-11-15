import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    createEnvelope: builder.mutation({
      query: ({ recipientEmail, recipientName, documentBase64 }) => ({
        url: "createEnvelope",
        method: "POST",
        body: {
          recipientEmail,
          recipientName,
          documentBase64,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const { useCreateEnvelopeMutation } = externalIntegrationsApi;
