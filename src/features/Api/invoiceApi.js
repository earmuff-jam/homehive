import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// LocalStorageKeys ...
// used to key items within the local storage
const LocalStorageKeys = {
  pdfDetails: "pdfDetails",
  receiver: "recieverInfo",
  sender: "senderInfo",
  templates: "templates",
};

// InvoiceApiTagTypes ...
// used to define the tag types for rtk query
const InvoiceApiTagTypes = {
  pdfDetails: "invoice/pdfDetails",
  receiver: "invoice/recieverInfo",
  sender: "invoice/senderInfo",
  templates: "invoice/templates",
};

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [LocalStorageKeys.receiver, LocalStorageKeys.sender],

  endpoints: (builder) => ({
    // getPdfDetails ...
    // defines a function that returns pdf details
    getPdfDetails: builder.query({
      queryFn: () => {
        try {
          return {
            data: {
              invoiceDetails: JSON.parse(localStorage.getItem("pdfDetails")),
              recieverInfo: JSON.parse(localStorage.getItem("recieverInfo")),
            },
          };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.pdfDetails],
    }),
    // getSenderInfo ...
    // defines a function that returns sender info
    getSenderInfo: builder.query({
      queryFn: () => {
        try {
          const data =
            JSON.parse(localStorage.getItem(LocalStorageKeys.sender)) || {};
          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.sender],
    }),
    // getRecieverInfo ...
    // defines a function that returns reciever info
    getReceiverInfo: builder.query({
      queryFn: () => {
        try {
          const data =
            JSON.parse(localStorage.getItem(LocalStorageKeys.receiver)) || {};
          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.receiver],
    }),
    // upsertPdfDetails ...
    // defines a function that creates / updates pdf details
    upsertPdfDetails: builder.mutation({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            LocalStorageKeys.pdfDetails,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.pdfDetails],
    }),
    // upsertSenderInfo ...
    // defines a function that upserts sender info
    upsertSenderInfo: builder.mutation({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            LocalStorageKeys.sender,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.sender],
    }),
    // upsertReceiverInfo ...
    // defines a function that upserts reciever info
    upsertReceiverInfo: builder.mutation({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            LocalStorageKeys.receiver,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.receiver],
    }),
    // getCustomTemplates ...
    // defines a function that retrieves custom template
    getCustomTemplates: builder.query({
      queryFn: () => {
        try {
          const data =
            JSON.parse(localStorage.getItem(LocalStorageKeys.templates)) || {};
          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.templates],
    }),
    // upsertCustomTemplate ...
    // defines a function that upserts reciever info
    upsertCustomTemplate: builder.mutation({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            LocalStorageKeys.templates,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.templates],
    }),
  }),
});

export const {
  useGetPdfDetailsQuery,
  useGetSenderInfoQuery,
  useGetReceiverInfoQuery,
  useUpsertPdfDetailsMutation,
  useUpsertSenderInfoMutation,
  useUpsertReceiverInfoMutation,
  useGetCustomTemplatesQuery,
  useUpsertCustomTemplateMutation,
} = invoiceApi;
