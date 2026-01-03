// Globally common types
import { ButtonProps, IconButtonProps } from "@mui/material";

// LoggedInUser ...
// defines the user who is currently logged in
export type LoggedInUser = {
  id: string;
  role?: string | null | undefined;
  email: string;
};

// AButtonProps ...
// defines props for AButton
export type AButtonProps = {
  label: string;
  loading?: boolean;
  onClick: () => void;
} & ButtonProps;
