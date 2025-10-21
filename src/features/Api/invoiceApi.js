import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const LocalStorageKeys = {
  sender: "senderInfo",
  receiver: "recieverInfo",
  pdfDetails: "pdfDetails",
};

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [LocalStorageKeys.receiver, LocalStorageKeys.sender],

  endpoints: (builder) => ({
    getPdfDetails: builder.query({
      queryFn: () => {
        try {
          return {
            data: {
              ...JSON.parse(localStorage.getItem("pdfDetails")),
              recieverInfo: JSON.parse(localStorage.getItem("recieverInfo")),
            },
          };
        } catch (err) {
          return { error: err };
        }
      },
    }),
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
      providesTags: [LocalStorageKeys.sender],
    }),
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
      providesTags: [LocalStorageKeys.receiver],
    }),
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
    }),
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
      invalidatesTags: [LocalStorageKeys.sender],
    }),
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
      invalidatesTags: [LocalStorageKeys.receiver],
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
} = invoiceApi;
