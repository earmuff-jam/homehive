import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// externalIntegrationMultipart ...
// defines a function used to process form data for electronic signature
export const externalIntegrationMultipart = createApi({
  reducerPath: "externalIntegrationMultipart",
  baseQuery: fetchBaseQuery({
    baseUrl: "/.netlify/functions/formDataProxy",
  }),
  endpoints: (builder) => ({
    sendPreparedDocument: builder.mutation({
      query: (formData) => ({
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useSendPreparedDocumentMutation } = externalIntegrationMultipart;
