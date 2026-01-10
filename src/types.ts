import { ReactNode } from "react";

// TUser ...
// defines the user for logged in user
export type TUser = {
  uid: string;
  role?: string | null | undefined;
  email: string;
};

// TUserDetails ...
// defines the userDetails for logged in user
export type TUserDetails = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  stripeAccountId?: string;
  googlePhotoURL?: string;
  googleDisplayName?: string;
};

// TThemeIdx ...
// defines prop for theme idx
export type TThemeIdx = "0" | "1";

// TAppRouteBreadcrumb ...
// defines props for app breadcrumbs
export type TAppRouteBreadcrumb = {
  value: string;
  icon: ReactNode;
};

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
