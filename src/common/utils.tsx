import { ReactNode } from "react";

import secureLocalStorage from "react-secure-storage";

import { Typography } from "@mui/material";
import { LoggedInUser } from "common/types";

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

export const createHelperSentences = (
  verbStr: string,
  extraClauseStr: string,
): ReactNode => {
  return (
    <Typography variant="caption">
      This help / guide is designed to aide you in learning how to&nbsp;
      {verbStr}&nbsp;{extraClauseStr}&nbsp;. Feel free to restart the guide if
      necessary.
    </Typography>
  );
};

export const fetchLoggedInUserT = (): LoggedInUser => {
  return secureLocalStorage.getItem("user") as LoggedInUser;
};

export const isBannerVisible = (pathname = ""): boolean => {
  if (pathname.includes(MainRentAppRouteUri)) {
    const user = fetchLoggedInUserT();
    if (!user?.role) return true;
  }
  return false;
};
