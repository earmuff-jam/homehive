import React from "react";

import secureLocalStorage from "react-secure-storage";

import { Typography } from "@mui/material";

export const HomeRouteUri = "/";
export const NotesRouteUri = "/notes";

export const FaqRoutePath = "/faq";

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

// pluralize ...
// defines a function that returns extra word based on variable count
export function pluralize(arrLength, wordStr) {
  if (arrLength <= 1) return wordStr;
  return `${wordStr}s`;
}

// createHelperSentences ...
// defines a function that creates helper sentences
export function createHelperSentences(verbStr, extraClauseStr) {
  return (
    <Typography variant="caption">
      This help / guide is designed to aide you in learning how to&nbsp;
      {verbStr}&nbsp;{extraClauseStr}&nbsp;. Feel free to restart the guide if
      necessary.
    </Typography>
  );
}

// fetchLoggedInUser ...
// defines a function where we return the user logged in values
export const fetchLoggedInUser = () => {
  return secureLocalStorage.getItem("user");
};

// isBasePlanUser ...
// defines a function to determine if a user is without a role
export const isBasePlanUser = (pathname = "") => {
  if (pathname.includes(MainRentAppRouteUri)) {
    const user = fetchLoggedInUser();
    if (!user?.role) return true;
  }
  return false;
};
