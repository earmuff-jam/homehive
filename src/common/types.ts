import { ReactElement, ReactNode } from "react";

import { AlertColor, ButtonProps } from "@mui/material";

// AButtonProps ...
// defines props for AButton
export type AButtonProps = {
  label: string;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & ButtonProps;

// TDialog ...
// defines props for Dialog
export type TDialog = {
  title: string;
  type: string;
  display: boolean;
};

// TAlert ...
// defines props for Alert
export type TAlert = {
  label: string;
  caption: string;
  severity: AlertColor;
  value: boolean;
  onClick?: () => void;
};

// THelpAndSupport ...
export type THelpAndSupport = {
  id: number;
  title: string;
  caption: string;
  icon: ReactElement;
  buttonText: string;
  to: string;
};

// TFrequentlyAskedQuestion ...
export type TFrequentlyAskedQuestion = {
  icon: ReactNode;
  question: string;
  answer: string;
};
