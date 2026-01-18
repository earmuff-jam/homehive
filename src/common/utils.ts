import secureLocalStorage from "react-secure-storage";

import { TAppRoute, TUser } from "src/types";

export const HomeRouteUri = "/";
export const FaqRoutePath = "/faq";
export const NotesRouteUri = "/notes";

// Default Rent App Routes
export const MainRentAppRouteUri = "/rent";

export const PropertiesRoutePath = "properties";
export const PropertiesRouteUri = "/rent/properties";

export const RentalRoutePath = "rental";
export const RentalRouteUri = "/rent/rental";

export const SettingsRoutePath = "settings";
export const SettingsRouteUri = "/rent/settings";

export const PropertyRoutePath = "property/:id";
export const PropertyRouteUri = "/rent/property/:id";

export const RentAppFaqRouteUri = "/rent/faq";

// Default Invoice App Routes
export const MainInvoiceAppRouteUri = "/invoice";

export const InvoiceDashboardRoutePath = "dashboard";
export const InvoiceDashboardRouteUri = "/invoice/dashboard";

export const ViewInvoiceRoutePath = "view";
export const ViewInvoiceRouteUri = "/invoice/view";

export const EditInvoiceRoutePath = "edit";
export const EditInvoiceRouteUri = "/invoice/edit";

export const SenderInforamtionRoutePath = "sender";
export const SenderInforamtionRouteUri = "/invoice/sender";

export const RecieverInforamtionRoutePath = "reciever";
export const RecieverInforamtionRouteUri = "/invoice/reciever";

export const InvoiceAppFaqRouteUri = "/invoice/faq";

export function pluralize(arrLength: number, wordStr: string): string {
  if (arrLength <= 1) return wordStr;
  return `${wordStr}s`;
}

// fetchLoggedInUser ...
export const fetchLoggedInUser = (): TUser | null => {
  const storedValue = secureLocalStorage.getItem("user");
  return storedValue as TUser;
};

// isBannerVisible ...
export const isBannerVisible = (pathname: string = ""): boolean => {
  if (pathname.includes(MainRentAppRouteUri)) {
    const user = fetchLoggedInUser();
    if (!user?.role) return true;
  }
  return false;
};

// rootLevelEnabledFeatures ...
export default function rootLevelEnabledFeatures() {
  const invoicerAppAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS;
  const invoicerAppEnabled = import.meta.env.VITE_ENABLE_INVOICER;
  const invoicerAppProFeaturesEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_PRO;
  const invoicerAppUserInformationEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_USER_INFORMATION;
  const invoicerAppSendEmailEnabled = import.meta.env.VITE_ENABLE_EMAIL_FEATURE;

  return new Map<string, boolean>([
    ["analytics", invoicerAppAnalyticsEnabled === "true"],
    ["invoicer", invoicerAppEnabled === "true"],
    ["invoicerPro", invoicerAppProFeaturesEnabled === "true"],
    ["userInformation", invoicerAppUserInformationEnabled === "true"],
    ["sendEmail", invoicerAppSendEmailEnabled === "true"],
  ]);
}

// isValidPermissions ...
export function isValidPermissions(
  enabledFeatures: Map<string, boolean>,
  requiredFlags: string[],
): boolean {
  const isRequired = requiredFlags?.every((flagValue) => {
    return enabledFeatures?.get(flagValue);
  });

  return isRequired;
}

// isSelectedFeatureEnabled ...
export const isSelectedFeatureEnabled = (key: string): boolean => {
  const enabledFlagMap = rootLevelEnabledFeatures();
  return enabledFlagMap.get(key) || false;
};

// filterValidRoutesForNavigationBar ...
export const filterValidRoutesForNavigationBar = (draftRoutes: TAppRoute[]) => {
  if (!draftRoutes) return [];
  return draftRoutes.filter(({ config }) => Boolean(config.displayInNavBar));
};

// retriveTourKey ...
export const retrieveTourKey = (
  currentUri: string,
  expectedStrValue: string,
): string => {
  const isDynamicPropertyPage =
    currentUri.includes(`/${expectedStrValue}/`) &&
    currentUri.split("/")[2] === expectedStrValue;

  // individual properties can share the same help && support
  return isDynamicPropertyPage ? PropertyRouteUri : currentUri;
};

// parseJsonUtility ...
// parses the json to a specific type T.
export function parseJsonUtility<T>(value: string | null): T | null {
  if (!value) {
    console.error("no value found to parse.");
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Failed to parse. ", error);
    return null;
  }
}
