import React from "react";

import {
  CancelRounded,
  DeblurRounded,
  DraftsRounded,
  LocalAtmRounded,
  PaidRounded,
} from "@mui/icons-material";

// WidgetTypeProps ...
// defines a constants for various widget types
export const WidgetTypeProps = {
  TimelineChart: "timeline-chart",
  TaxChart: "tax-chart",
  ServiceChart: "service-chart",
  DetailsTable: "details-table",
};

// WidgetTypeList ...
// defines a constants of various types of widgets
export const WidgetTypeList = [
  {
    id: 1,
    type: WidgetTypeProps.TimelineChart,
    label: "Timeline Chart",
    caption: "View invoice in timeline",
    config: {
      height: "25rem",
      width: "40rem",
    },
  },
  {
    id: 2,
    type: WidgetTypeProps.TaxChart,
    label: "Collected tax and totals",
    caption: "View collected amount in dollars",
    columns: [],
    data: [],
    config: {
      height: "25rem",
      width: "40rem",
    },
  },
  {
    id: 3,
    type: WidgetTypeProps.ServiceChart,
    label: "Items / Service Type",
    caption: "View invoice based on items",
    columns: [],
    data: [],
    config: {
      height: "25rem",
      width: "40rem",
    },
  },
  {
    id: 4,
    type: WidgetTypeProps.DetailsTable,
    label: "Item Details Table",
    caption: "View invoice details",
    columns: [],
    data: [],
    config: {
      height: "25rem",
      width: "50rem",
    },
  },
];

// DefaultInvoiceStatusOptions ...
// defines the type for default invoice status options
export const DefaultInvoiceStatusOptions = [
  {
    id: 1,
    label: "Paid",
    selected: true,
    display: true,
  },
  {
    id: 2,
    label: "Draft",
    selected: false,
    display: true,
  },
  {
    id: 3,
    label: "Overdue",
    selected: false,
    display: true,
  },
  {
    id: 4,
    label: "Cancelled",
    selected: false,
    display: true,
  },
  {
    id: 5,
    label: "None",
    selected: false,
    display: false, // does not display status if none is selected
  },
];

// DefaultInvoiceStatusIcons ...
// defines a invoice status icons
export const DefaultInvoiceStatusIcons = {
  Paid: <PaidRounded fontSize="small" />,
  Draft: <DraftsRounded fontSize="small" />,
  Overdue: <LocalAtmRounded fontSize="small" />,
  Cancelled: <CancelRounded fontSize="small" />,
  None: <DeblurRounded fontSize="small" />,
};

// InvoiceCategoryOptions ...
// defines options for inovoice category
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
