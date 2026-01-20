import z from "zod";

// TWidgetConfigSchema ...
// defines schema for TWidgetConfig
export const TWidgetConfigSchema = z.object({
  inset: z.boolean(), // makes text have extra spacing in front
  height: z.string(),
  width: z.string(),
  widgetId: z.string(),
});

// TWidgetSchema ...
// defines schema for TWidget
export const TWidgetSchema = z.object({
  id: z.number(), // used for selecting widget
  widgetID: z.string(), // used for drag and drop
  label: z.string(),
  caption: z.string(),
  columns: z.array(z.string()),
  data: z.array(z.string()),
  config: TWidgetConfigSchema,
});

// TCategorySchema ...
// defines schema for TCategory
export const TCategorySchema = z.object({
  label: z.string(),
  value: z.string(),
});

// TInvoiceStatusOptionSchema ...
// defines the schema for TInvoiceStatusOption
export const TInvoiceStatusOptionSchema = z.object({
  id: z.number(),
  label: z.string(),
  icon: z.string(),
  selected: z.boolean(),
  display: z.boolean(),
});

// TLineItemSchema ...
// defines schema for TLineItem
export const TLineItemSchema = z.object({
  description: z.string(),
  caption: z.string(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  payment: z.coerce.number(),
  paymentMethod: z.string(),
  category: TCategorySchema,
});

// TInvoiceSchema ...
// defines schema for TInvoice
export const TInvoiceSchema = z.object({
  title: z.string(),
  caption: z.string(),
  note: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  header: z.string(),
  taxRate: z.coerce.number(),
  invoiceStatus: TInvoiceStatusOptionSchema,
  lineItems: z.array(TLineItemSchema),
  updatedOn: z.string(),
});

// TInvoiceRowSchema ...
// defines the schema for TInvoiceRow
export const TInvoiceRowSchema = z.object({
  category: z.string(),
  invoiceStatus: TInvoiceStatusOptionSchema,
  startDate: z.string(),
  endDate: z.string(),
  total: z.number(),
  paymentMethod: z.string(),
  updatedOn: z.string(),
});

// TItemTypeChartRowSchema ...
// defines the schema for TItemTypeChartRow
export const TItemTypeChartRowSchema = z.object({
  label: z.string(),
  data: z.array(z.number()),
  backgroundColor: z.string(),
  borderWidth: z.number(),
  borderColor: z.string(),
  fill: z.boolean(),
  tension: z.number(),
});

// TInvoiceItemTypeChartDataSchema ...
// defines the schema for TInvoiceItemTypeChartData
export const TInvoiceItemTypeChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(TItemTypeChartRowSchema),
});

// TScatterChartSchema ...
// defines the schema for TScatterChart
export const TScatterChartSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(TItemTypeChartRowSchema),
});

// TInvoiceUserInfoSchema ...
// defines the schema for TInvoiceUserInfo
export const TInvoiceUserInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  updatedOn: z.string(),
});

// export types
export type TWidget = z.infer<typeof TWidgetSchema>;
export type TWidgetConfig = z.infer<typeof TWidgetConfigSchema>;
export type TCategory = z.infer<typeof TCategorySchema>;
export type TLineItem = z.infer<typeof TLineItemSchema>;
export type TInvoice = z.infer<typeof TInvoiceSchema>;
export type TInvoiceStatusOption = z.infer<typeof TInvoiceStatusOptionSchema>;
export type TInvoiceRow = z.infer<typeof TInvoiceRowSchema>;
export type TItemTypeChartRow = z.infer<typeof TItemTypeChartRowSchema>;
export type TScatterChart = z.infer<typeof TScatterChartSchema>;
export type TInvoiceUserInfo = z.infer<typeof TInvoiceUserInfoSchema>;
export type TInvoiceItemTypeChartData = z.infer<
  typeof TInvoiceItemTypeChartDataSchema
>;
