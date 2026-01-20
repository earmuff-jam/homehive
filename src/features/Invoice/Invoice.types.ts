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

// TInvoiceRowHeader ...
export type TInvoiceRowHeader = {
  title: string;
  caption: string;
  showDate?: boolean;
  createdDate?: Dayjs;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
};
