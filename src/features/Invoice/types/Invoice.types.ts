/**
 * Invoice types
 */
import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import type { SxProps, Theme } from "@mui/material/styles";

export type ChartType = "bar" | "line";

// InvoiceAppBreadcrumb ...
export type InvoiceAppBreadcrumb = {
  value: string;
  icon: ReactNode;
};

// InvoiceAppRouteConfig ...
export type InvoiceAppRouteConfig = {
  breadcrumb: InvoiceAppBreadcrumb;
  displayInNavBar: boolean;
  displayHelpSelector: boolean;
  displayPrintSelector: boolean;
};

// InvoiceAppRoute ...
export type InvoiceAppRoute = {
  id: number;
  label: string;
  path: string;
  routeUri: string;
  element: ReactNode;
  icon: ReactNode;
  requiredFlags: string[];
  config: InvoiceAppRouteConfig;
};

// WidgetConfig ...
export type WidgetConfig = {
  inset: boolean; // makes text have extra spacing infront
  height: string;
  width: string;
  widgetId: string; // for provision only
};

// WidgetType ...
export type WidgetType = {
  id: number;
  label: string;
  caption: string;
  columns: string[];
  data: string[];
  config: WidgetConfig;
};

// AddWidgetProps ...
export type AddWidgetProps = {
  handleAddWidget: (widgetId: number) => void;
};

// InvoiceStatusOption ...
export type InvoiceStatusOption = {
  id: number;
  label: string;
  icon: ReactNode;
  selected: boolean;
  display: boolean;
};

// Category ...
export type Category = {
  label: string;
  value: string;
};

// LineItem ...
export type LineItem = {
  payment: number;
  paymentMethod: string;
  category: Category;
};

// Invoice ...
export type Invoice = {
  lineItems: LineItem[];
  invoiceStatus: string;
  taxRate: number;
  startDate: Dayjs;
  endDate: Dayjs;
  updatedOn: Dayjs;
};

// InvoiceRow ...
export type InvoiceRow = {
  category: string;
  invoiceStatus: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  total: number;
  paymentMethod: string;
  updatedOn: Dayjs;
};

// ItemTypeChartRow ...
export type ItemTypeChartRow = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  fill: boolean;
  tension: number;
};

// InvoiceItemTypeChartData ...
export type InvoiceItemTypeChartData = {
  labels: string[];
  datasets: ItemTypeChartRow[];
};

// MonthTotal ...
export type MonthTotal = {
  collected: number;
  tax: number;
};

// TrendsChartDataset ...
export type TrendsChartDataset = {
  labels: string[];
  datasets: ItemTypeChartRow[];
};

// TimeLineChartDataset ...
export type TimeLineChartDataset = {
  labels: string[];
  datasets: ItemTypeChartRow[];
};

// InvoiceRowHeader ...
// defines prop for RowHeader in Invoice App
export type InvoiceRowHeader = {
  title: string;
  caption: string;
  showDate?: boolean;
  createdDate?: Dayjs;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
};

// UserInfo ...
// defines props for user for salutation
export type UserInfo = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  updatedOn: Dayjs;
};
