import {
  CancelRounded,
  DeblurRounded,
  DraftsRounded,
  LocalAtmRounded,
  PaidRounded,
} from "@mui/icons-material";
import {
  Category,
  InvoiceStatusOption,
  WidgetType,
} from "features/Invoice/types/Invoice.types";

/* The `WidgetTypeList` constant is defining an array of objects, where each object represents a
specific type of widget that can be used in the application. Each widget object has properties such
as `id`, `label`, `caption`, `columns`, `data`, and `config`. Here's a breakdown of what each
property represents: */
export const WidgetTypeList: WidgetType[] = [
  {
    id: 1,
    label: "Invoice Timeline Chart",
    caption: "Displays period of timeline events",
    columns: [],
    data: [],
    config: {
      inset: false,
      height: "25rem",
      width: "45rem",
      widgetId: "9caef12d-a611-4573-8fd2-b5bd3036ce13",
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
      widgetId: "c04637c7-080d-4641-a4f4-4fd523280d74",
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
      widgetId: "052fda00-2d37-4d0f-81b7-3fcb451e5ee1",
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
      widgetId: "a4c036a4-feef-4f2b-bb90-b5eea115fcce",
    },
  },
];

/* The `DefaultInvoiceStatusOptions` constant is defining an array of objects, where each object
represents an invoice status option. Each object has the following properties:
- `id`: A unique identifier for the status option.
- `label`: The display label for the status option (e.g., "Paid", "Draft", "Overdue", "Cancelled",
"None").
- `icon`: An icon component associated with the status option.
- `selected`: A boolean indicating whether the status option is selected or not.
- `display`: A boolean indicating whether the status option should be displayed or not. */
export const DefaultInvoiceStatusOptions: InvoiceStatusOption[] = [
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

/* The `InvoiceCategoryOptions` constant is defining an array of objects that represent different
categories for invoices. Each object in the array has two properties:
- `label`: Represents the display label for the category (e.g., "Products", "Services", "Fees").
- `value`: Represents the value associated with the category (e.g., "products", "services", "fees"). */
export const InvoiceCategoryOptions: Category[] = [
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
