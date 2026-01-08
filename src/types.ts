import { ReactNode } from "react";

// TAuditColumns ...
// defines the audit column for each table
export type TAuditColumns = {
  createdBy: string;
  createdOn: string;
  updatedBy?: string;
  updatedOn?: string;
};

// TGeoLocationCoordinates ...
// defines the geolocation data for a user
export type TGeoLocationCoordinates = {
  lat: number;
  lon: number;
};

// TBaseAuthIdentity ...
// defines the base auth identity
export type TBaseAuthIdentity = TAuditColumns & {
  uid: string;
  email: string;
  googleDisplayName?: string;
  googlePhotoURL?: string;
  provider?: string;
  googleAccountLinkedAt?: string;
  googleLastLoginAt?: string;
};

// TUser ...
// defines a logged in user
export type TUser = TBaseAuthIdentity & {
  role?: "USER" | "ADMIN" | "TENANT" | null;
};

// TProfileForm ...
// defines a type to represent a user profile form
export type TProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

// TUserDetails ...
// defines extra user details props
export type TUserDetails = TUser &
  TProfileForm & {
    stripeAccountId?: string;
    stripeAccountIsActive: boolean;
    esignAccountWorkspaceId?: string;
    eSignAccountIsActive: boolean;
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

// TCustomError ...
// defines prop for custom error handling
export type TCustomError = {
  message: string;
  code: number;
};

// TIpApiResponse ...
export type TIpApiResponse = {
  ip: string;
  city: string;
  country_name: string;
};

// TRequiredIpValues ...
export type TRequiredIpValues = {
  ipAddress: string;
  city: string;
  country: string;
};

// TReleaseNotes ...
export type TReleaseNotes = {
  type: string;
  value: string;
  caption: string;
};

// TReleaseDetails ...
export type TReleaseDetails = {
  version: string;
  date: string;
  notes: TReleaseNotes[];
};
