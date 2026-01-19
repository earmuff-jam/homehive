import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Invoice, UserInfo } from "features/Invoice/Invoice.types";
import { TCustomError } from "src/types";

// TTagSender ...
type TTagSender = "sender";
// TTagReceiver ...
type TTagReceiver = "receiver";
// TTagPdfDetails ...
type TTagPdfDetails = "pdfDetails";

// TTagTypes ...
export type TTagTypes = {
  Sender: TTagSender;
  Receiver: TTagReceiver;
  PdfDetails: TTagPdfDetails;
};

export const localStorageKeysTagTypes: TTagTypes = {
  Sender: "sender",
  Receiver: "receiver",
  PdfDetails: "pdfDetails",
};

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fakeBaseQuery<TCustomError>(),
  tagTypes: [
    localStorageKeysTagTypes.Receiver,
    localStorageKeysTagTypes.Sender,
  ],

  endpoints: (builder) => ({
    getPdfDetails: builder.query<Invoice, void>({
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
    getSenderInfo: builder.query<UserInfo, void>({
      queryFn: () => {
        try {
          const data = JSON.parse(localStorage.getItem("senderInfo")) || {};
          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [localStorageKeysTagTypes.Sender],
    }),
    getReceiverInfo: builder.query<UserInfo, void>({
      queryFn: () => {
        try {
          const data = JSON.parse(localStorage.getItem("recieverInfo")) || {};
          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [localStorageKeysTagTypes.Receiver],
    }),
    upsertPdfDetails: builder.mutation<Invoice, Invoice>({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            localStorageKeysTagTypes.PdfDetails,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
    }),
    upsertSenderInfo: builder.mutation<UserInfo, UserInfo>({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            localStorageKeysTagTypes.Sender,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [localStorageKeysTagTypes.Sender],
    }),
    upsertReceiverInfo: builder.mutation<UserInfo, UserInfo>({
      queryFn: (newData) => {
        try {
          localStorage.setItem(
            localStorageKeysTagTypes.Receiver,
            JSON.stringify(newData),
          );
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [localStorageKeysTagTypes.Receiver],
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
