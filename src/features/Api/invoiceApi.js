import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const LocalStorageKeys = {
  sender: "senderInfo",
  receiver: "receiverInfo",
};

const InvoiceApiTagTypes = {
  senderInfo: "senderInfo",
  recieverInfo: "recieverInfo",
};

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [InvoiceApiTagTypes.recieverInfo, InvoiceApiTagTypes.senderInfo],

  endpoints: (builder) => ({
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
      providesTags: [InvoiceApiTagTypes.senderInfo],
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
      providesTags: [InvoiceApiTagTypes.recieverInfo],
    }),

    upsertSenderInfo: builder.mutation({
      queryFn: (newData) => {
        try {
          const oldData =
            JSON.parse(localStorage.getItem(LocalStorageKeys.sender)) || {};
          const merged = { ...oldData, ...newData };
          localStorage.setItem(LocalStorageKeys.sender, JSON.stringify(merged));
          return { data: merged };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.senderInfo],
    }),

    upsertReceiverInfo: builder.mutation({
      queryFn: (newData) => {
        try {
          const oldData =
            JSON.parse(localStorage.getItem(LocalStorageKeys.receiver)) || {};
          const merged = { ...oldData, ...newData };
          localStorage.setItem(
            LocalStorageKeys.receiver,
            JSON.stringify(merged),
          );
          return { data: merged };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.recieverInfo],
    }),
  }),
});

export const {
  useGetSenderInfoQuery,
  useGetReceiverInfoQuery,
  useUpsertSenderInfoMutation,
  useUpsertReceiverInfoMutation,
} = invoiceApi;
