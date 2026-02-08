import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const TagTypes = {
  SendEmail: "send-email",
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
  }),
});

export const {
  useSendEmailMutation,
  useGetEsignTemplatesQuery,
  useGetWorkspacesMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useCreateEsignFromTemplateMutation,
} = externalIntegrationsApi;
