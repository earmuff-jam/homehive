import dayjs from "dayjs";

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
