import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TagTypes = {
  EsignTemplates: "esign-templates",
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
  }),
});

export const {
  useGetEsignTemplatesQuery,
  useCreateWorkspaceMutation,
  useGetWorkspacesMutation,
  useCreateTemplateMutation,
} = externalIntegrationsApi;
