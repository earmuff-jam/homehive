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
    getWorkspaces: builder.mutation({
      query: () => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0013_fetch_esign_status",
          fMethod: "POST",
        }),
      }),
    }),
    createWorkspace: builder.mutation({
      query: (workspaceId) => ({
        method: "POST",
        body: JSON.stringify({
          fUrl: "0014_create_esign_workspace",
          fMethod: "POST",
          payload: workspaceId,
        }),
      }),
    }),
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

export const {
  useCreateWorkspaceMutation,
  useCreateEnvelopeMutation,
  useGetWorkspacesMutation,
} = externalIntegrationsApi;
