import { ButtonProps } from "@mui/material";

// AButtonProps ...
// defines props for AButton
export type AButtonProps = {
  label: string;
  loading?: boolean;
  onClick?: () => void;
} & ButtonProps;
