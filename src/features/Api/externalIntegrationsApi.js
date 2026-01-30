import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TagTypes = {
  EsignTemplates: "esign-templates",
  EsignWorkspaces: "esign-workspaces",
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
      providesTags: [TagTypes.EsignWorkspaces],
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
  }),
});

export const {
  useGetEsignTemplatesQuery,
  useGetWorkspacesMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useCreateEsignFromTemplateMutation,
} = externalIntegrationsApi;
