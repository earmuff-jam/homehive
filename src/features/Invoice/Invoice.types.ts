/**
 * Invoice types
 */
import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import type { SxProps, Theme } from "@mui/material/styles";

export type ChartType = "bar" | "line";

// TInvoiceOutletContext ...
export type TInvoiceOutletContext = [boolean];

// TOutletContext ...
export type TOutletContext = {
  showWatermark: boolean;
};

// TCategory ...
// defines type for each category of payment
export type TCategory = {
  label: string;
  value: string;
};

// LineItem ...
export type LineItem = {
  description: string;
  caption: string;
  quantity: number;
  price: number;
  payment: number;
  paymentMethod: string;
  category: TCategory;
};

// Invoice ...
export type Invoice = {
  title: string;
  caption: string;
  note: string;
  startDate: Dayjs;
  endDate: Dayjs;
  header: string;
  taxRate: number;
  invoiceStatus: TInvoiceStatusOption;
  lineItems: LineItem[];
  updatedOn: Dayjs;
};

// InvoiceRow ...
export type InvoiceRow = {
  category: string;
  invoiceStatus: TInvoiceStatusOption;
  startDate?: Dayjs;
  endDate?: Dayjs;
  total: number;
  paymentMethod: string;
  updatedOn: Dayjs;
};

// TInvoiceStatusOption ...
export type TInvoiceStatusOption = {
  id: number;
  label: string;
  icon: ReactNode;
  selected: boolean;
  display: boolean;
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

// TInvoiceDialog ...
export type TInvoiceDialog = {
  title: string;
  label: string;
  type: string;
  showWatermark: boolean;
  display: boolean;
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

// TInvoiceRowHeader ...
export type TInvoiceRowHeader = {
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
