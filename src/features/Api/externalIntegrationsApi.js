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
    // used to provide status for Esign
    getWorkspaces: builder.mutation({
      query: () => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0013_fetch_esign_status",
          fMethod: "POST",
        }),
      }),
    }),
    createEnvelope: builder.mutation({
      query: (base64FileData) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0014_create_esign_envelope",
          fMethod: "POST",
          payload: base64FileData,
        }),
      }),
    }),
  }),
});

export const { useCreateEnvelopeMutation, useGetWorkspacesMutation } =
  externalIntegrationsApi;
