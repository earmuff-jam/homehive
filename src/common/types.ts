// Globally common types
import { ReactNode } from "react";

import { ButtonProps } from "@mui/material";

// TUser ...
// defines the user who is currently logged in
export type TUser = {
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

// TAppRouteBreadcrumb ...
// defines props for app breadcrumbs
export type TAppRouteBreadcrumb = {
  value: string;
  icon: ReactNode;
};

// TThemeIdx ...
// defines prop for theme idx
export type TThemeIdx = "0" | "1";

// TAppRouteConfig ...
// defines props for app route config
export type TAppRouteConfig = {
  breadcrumb: TAppRouteBreadcrumb;
  displayInNavBar: boolean;
  displayHelpSelector: boolean;
  displayPrintSelector: boolean;
  isLoggedInFeature: boolean;
};

// TAppRoute ...
// defines props for App route
export type TAppRoute = {
  id: number;
  label: string;
  path: string;
  routeUri: string;
  element: ReactNode;
  icon: ReactNode;
  requiredFlags: string[];
  config: TAppRouteConfig;
};
