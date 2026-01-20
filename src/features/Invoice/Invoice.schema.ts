import z from "zod";

export const TCategorySchema = z.object({
  label: z.string(),
  value: z.string(),
});

// TWidgetConfigSchema ...
// defines schema for TWidgetConfig
export const TWidgetConfigSchema = z.object({
  inset: z.boolean(), // makes text have extra spacing in front
  height: z.string(),
  width: z.string(),
  widgetId: z.string(),
});

// TWidgetSchema ...
// defines the config for TWidget
export const TWidgetSchema = z.object({
  id: z.number(), // used for selecting widget
  widgetID: z.string(), // used for drag and drop
  label: z.string(),
  caption: z.string(),
  columns: z.array(z.string()),
  data: z.array(z.string()),
  config: TWidgetConfigSchema,
});

// export types
export type TWidget = z.infer<typeof TWidgetSchema>;
export type TWidgetConfig = z.infer<typeof TWidgetConfigSchema>;
