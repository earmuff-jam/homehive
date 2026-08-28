import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// KeyMap ...
// used to key items within the local storage
const KeyMap = {
  InvoiceList: "invoiceList",
  receiver: "receiverInfo",
  sender: "senderInfo",
  templates: "templates",
  DashboardWidgets: "dashboardWidgets",
};

// InvoiceApiTagTypes ...
// used to define the tag types for rtk query
const InvoiceApiTagTypes = {
  getInvoiceList: "invoice/getInvoiceList",
  getInvoice: "invoice/getInvoice",
  getDashboardWidgets: "invoice/getDashboardWidgets",
  receiver: "invoice/recieverInfo",
  sender: "invoice/senderInfo",
  templates: "invoice/templates",
};

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(InvoiceApiTagTypes),
  endpoints: (builder) => ({
    // getInvoiceList ...
    // defines a function that returns a list of pdf invoices
    getInvoiceList: builder.query({
      queryFn: () => {
        try {
          return {
            data: {
              invoiceDetails: JSON.parse(
                localStorage.getItem(KeyMap.InvoiceList),
              ),
              senderDetails: JSON.parse(localStorage.getItem(KeyMap.sender)),
              receiverDetails: JSON.parse(
                localStorage.getItem(KeyMap.receiver),
              ),
            },
          };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.getInvoiceList],
    }),

    // getInvoices ...
    // defines a function that returns invoices that match passed in IDs
    getInvoices: builder.query({
      queryFn: ({ invoiceIDs }) => {
        try {
          const invoiceList = JSON.parse(
            localStorage.getItem(KeyMap.InvoiceList),
          );

          return {
            data: invoiceList?.filter((invoice) =>
              invoiceIDs.includes(invoice?.id),
            ),
          };
        } catch (err) {
          return { error: err };
        }
      },
    }),

    // getSenderInfo ...
    // defines a function that returns sender info
    getSenderInfo: builder.query({
      queryFn: ({ invoiceID }) => {
        try {
          const data = JSON.parse(localStorage.getItem(KeyMap.sender)) || [];
          const senderInfo = data?.find((el) => el.invoiceID === invoiceID);
          return { data: senderInfo };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.sender],
    }),

    // getReceiverInfo ...
    // defines a function that returns receiver info
    getReceiverInfo: builder.query({
      queryFn: ({ invoiceID }) => {
        try {
          const data = JSON.parse(localStorage.getItem(KeyMap.receiver)) || [];
          const receiverInfo = data?.find((el) => el.invoiceID === invoiceID);
          return { data: receiverInfo };
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
          const existingInvoices = JSON.parse(
            localStorage.getItem(KeyMap.InvoiceList) || "[]",
          );

          const invoiceIndex = existingInvoices.findIndex(
            (invoice) => invoice.id === newData.id,
          );

          if (invoiceIndex >= 0) {
            existingInvoices[invoiceIndex] = newData;
          } else {
            existingInvoices.push(newData);
          }

          localStorage.setItem(
            KeyMap.InvoiceList,
            JSON.stringify(existingInvoices),
          );

          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [
        InvoiceApiTagTypes.pdfDetails,
        InvoiceApiTagTypes.getInvoiceList,
      ],
    }),

    // upsertSenderInfo ...
    // defines a function that upserts sender info
    upsertSenderInfo: builder.mutation({
      queryFn: (newData) => {
        try {
          const existingSenders = JSON.parse(
            localStorage.getItem(KeyMap.sender) || "[]",
          );

          const senderInvoiceIdx = existingSenders.findIndex(
            (sender) => sender.invoiceID === newData.invoiceID,
          );

          if (senderInvoiceIdx >= 0) {
            existingSenders[senderInvoiceIdx] = newData;
          } else {
            existingSenders.push(newData);
          }

          localStorage.setItem(KeyMap.sender, JSON.stringify(existingSenders));

          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },

      invalidatesTags: [
        InvoiceApiTagTypes.sender,
        InvoiceApiTagTypes.getInvoiceList,
      ],
    }),

    // upsertReceiverInfo ...
    // defines a function that upserts reciever info
    upsertReceiverInfo: builder.mutation({
      queryFn: (newData) => {
        try {
          const existingReceivers = JSON.parse(
            localStorage.getItem(KeyMap.receiver) || "[]",
          );

          const receiverInvoiceIdx = existingReceivers.findIndex(
            (receiver) => receiver.invoiceID === newData.invoiceID,
          );

          if (receiverInvoiceIdx >= 0) {
            existingReceivers[receiverInvoiceIdx] = newData;
          } else {
            existingReceivers.push(newData);
          }

          localStorage.setItem(
            KeyMap.receiver,
            JSON.stringify(existingReceivers),
          );

          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [
        InvoiceApiTagTypes.receiver,
        InvoiceApiTagTypes.getInvoiceList,
      ],
    }),

    // getCustomTemplates ...
    // defines a function that retrieves custom template
    getCustomTemplates: builder.query({
      queryFn: () => {
        try {
          const data = JSON.parse(localStorage.getItem(KeyMap.templates)) || {};
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
          localStorage.setItem(KeyMap.templates, JSON.stringify(newData));
          return { data: newData };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.templates],
    }),

    // getDashboardWidgets ...
    // defines a function that retrieves custom widgets for the dashboard
    getDashboardWidgets: builder.query({
      queryFn: () => {
        try {
          const data =
            JSON.parse(localStorage.getItem(KeyMap.DashboardWidgets)) || [];

          return { data: data || [] };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: [InvoiceApiTagTypes.getDashboardWidgets],
    }),

    // upsertDashboardWidgets ...
    // defines a function that upserts dashboard widgets
    upsertDashboardWidgets: builder.mutation({
      queryFn: (data) => {
        try {
          localStorage.setItem(KeyMap.DashboardWidgets, JSON.stringify(data));

          return { data: data };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: [InvoiceApiTagTypes.getDashboardWidgets],
    }),
  }),
});

export const {
  useGetInvoiceListQuery,
  useGetInvoicesQuery,
  useGetSenderInfoQuery,
  useGetReceiverInfoQuery,
  useUpsertPdfDetailsMutation,
  useUpsertSenderInfoMutation,
  useUpsertReceiverInfoMutation,
  useGetCustomTemplatesQuery,
  useUpsertCustomTemplateMutation,
  useGetDashboardWidgetsQuery,
  useUpsertDashboardWidgetsMutation,
} = invoiceApi;
