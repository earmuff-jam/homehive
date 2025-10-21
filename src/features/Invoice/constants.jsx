import React from "react";

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
