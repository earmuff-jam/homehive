import React from "react";

import dayjs from "dayjs";

import {
  CancelRounded,
  DeblurRounded,
  DraftsRounded,
  LocalAtmRounded,
  PaidRounded,
} from "@mui/icons-material";

/**
 * WidgetTypeList ...
 *
 * widget type list is the different types of widgets
 * that we can display in the dashboard
 */
export const WidgetTypeList = [
  {
    id: 1,
    label: "Invoice Timeline Chart",
    caption: "Displays period of timeline events",
    config: {
      inset: false, // makes text have extra spacing infront
      height: "25rem",
      width: "45rem",
      widgetID: "9caef12d-a611-4573-8fd2-b5bd3036ce13", // widgetID for config is for provision only
    },
  },
  {
    id: 2,
    label: "Collected tax and totals",
    caption: "Visual diagram of collected tax and invoice total.",
    columns: [],
    data: [],
    config: {
      inset: false,
      height: "25rem",
      width: "45rem",
      widgetID: "c04637c7-080d-4641-a4f4-4fd523280d74",
    },
  },
  {
    id: 3,
    label: "Items / Service Type",
    caption: "Visual diagram of charge based on items or created service type.",
    columns: [],
    data: [],
    config: {
      inset: false,
      height: "25rem",
      width: "45rem",
      widgetID: "052fda00-2d37-4d0f-81b7-3fcb451e5ee1",
    },
  },
  {
    id: 4,
    label: "Item Details Table",
    caption: "View details about imported invoices in list form.",
    columns: [],
    data: [],
    config: {
      inset: false,
      height: "25rem",
      width: "75rem",
      widgetID: "a4c036a4-feef-4f2b-bb90-b5eea115fcce",
    },
  },
];

/**
 * DefaultInvoiceStatusOptions ...
 *
 * default invoice status options used to mark
 * the status of the invoice
 */
export const DefaultInvoiceStatusOptions = [
  {
    id: 1,
    label: "Paid",
    icon: <PaidRounded />,
    selected: true,
    display: true,
  },
  {
    id: 2,
    label: "Draft",
    icon: <DraftsRounded />,
    selected: false,
    display: true,
  },
  {
    id: 3,
    label: "Overdue",
    icon: <LocalAtmRounded />,
    selected: false,
    display: true,
  },
  {
    id: 4,
    label: "Cancelled",
    icon: <CancelRounded />,
    selected: false,
    display: true,
  },
  {
    id: 5,
    label: "None",
    icon: <DeblurRounded />,
    selected: false,
    display: false, // does not display status if none is selected
  },
];

/**
 * Invoice Category Options
 *
 * used to build out the autocomplete component in edit / view invoice
 */
export const InvoiceCategoryOptions = [
  { label: "Products", value: "products" },
  { label: "Services", value: "services" },
  { label: "Fees", value: "fees" },
  { label: "Subscriptions/Recurring Charges", value: "subscriptions" },
  { label: "Travel & Lodging", value: "travelLodging" },
  { label: "Marketing & Advertising", value: "marketing" },
  { label: "Office/Administrative", value: "officeAdmin" },
  { label: "Utilities & Overhead", value: "utilities" },
  { label: "Taxes", value: "taxes" },
  { label: "Other", value: "other" },
];

export const GENERIC_FORM_FIELDS = {
  type: "text",
  variant: "outlined",
};

export const TEXTAREA_FORM_FIELDS = {
  multiline: true,
  minRows: 4,
  variant: "outlined",
};

/**
 * Blank Invoice Details form
 */
export const BLANK_INVOICE_DETAILS_FORM = {
  title: {
    id: "title",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [],
  },
  caption: {
    id: "caption",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [],
  },
  note: {
    id: "note",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [
      {
        validate: (value) => value.trim().length >= 150,
        message: "Notes should be less than 150 characters",
      },
    ],
    ...TEXTAREA_FORM_FIELDS,
  },
  start_date: {
    id: "start_date",
    value: dayjs().toISOString(), // default value; prevents leak
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Start Date is required",
      },
      {
        validate: (value) => value.trim().length >= 15,
        message: "Start Date should be less than 15 characters",
      },
    ],
  },
  end_date: {
    id: "end_date",
    value: dayjs().toISOString(), // default value; prevents leak
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "End date is required",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "End date should be less than 150 characters",
      },
    ],
  },
  tax_rate: {
    id: "tax_rate",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Tax rate is required",
      },
      {
        validate: (value) => value.trim().length >= 5,
        message: "Tax rate should be less than 5 characters",
      },
      {
        validate: (value) => !/^\d{1,2}(\.\d{1,2})?$/.test(value),
        message: "Tax rate should be a valid tax rate (e.g., 7.25)",
      },
    ],
  },
  invoice_header: {
    id: "invoice_header",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [],
  },
};

/**
 * Blank Invoice Details form
 */
export const BLANK_INVOICE_LINE_ITEM_FORM = {
  category: {
    id: "category",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.length <= 0,
        message: "Select the category of the single item.",
      },
    ],
  },
  descpription: {
    id: "descpription",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [],
  },
  caption: {
    id: "caption",
    value: "",
    errorMsg: "",
    isRequired: false,
    validators: [],
  },
  quantity: {
    id: "quantity",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => !/^\d+$/.test(value),
        message: "Quantity must be a positive integer",
      },
      {
        validate: (value) => parseInt(value, 10) > 9999,
        message: "Quantity should be less than or equal to 9999",
      },
    ],
  },
  price: {
    id: "price",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => !/^\d+(\.\d{1,2})?$/.test(value),
        message: "Price must be a valid number with up to two decimal places",
      },
      {
        validate: (value) => parseFloat(value) <= 0,
        message: "Price must be greater than 0",
      },
    ],
  },
  payment: {
    id: "payment",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => !/^\d+(\.\d{1,2})?$/.test(value),
        message: "Payment must be a valid number with up to two decimal places",
      },
    ],
  },
  payment_method: {
    id: "payment_method",
    value: "",
    errorMsg: "",
    isRequired: true,
    validators: [
      {
        validate: (value) => value.trim().length <= 0,
        message: "Method of payment is required",
      },
      {
        validate: (value) => value.trim().length >= 150,
        message: "Method of payment should be less than 150 characters",
      },
    ],
  },
};
