/**
 * Utils file
 *
 * Used to create common minor functions that can be re-used across the application
 */
import { Typography } from "@mui/material";

/**
 * Route params
 *
 * used to build routes.
 */

export const HomeRouteUri = "/";
export const FaqRouteUri = "/faq";
export const NotesRouteUri = "/notes";
export const SettingsRouteUri = "/settings";

export const RentalRouteUri = "/rental";
export const PropertyRouteUri = "/property/:id";
export const PropertiesRouteUri = "/properties";

export const InvoiceDefaultRouteUri = "/invoice";
export const ViewInvoiceRouteUri = "/invoice/view";
export const EditInvoiceRouteUri = "/invoice/edit";
export const SenderInforamtionRouteUri = "/invoice/sender";
export const InvoiceDashboardRouteUri = "/invoice/dashboard";
export const RecieverInforamtionRouteUri = "/invoice/reciever";

/**
 * pluralize
 *
 * function used to add a plural form where applicable.
 *
 * @param {int} arrLength - the length of the array that needs to be tabulated.
 * @param {string} wordStr - the string representation of the selected word.
 *
 * @returns a plural form of the selected word
 *
 */
export function pluralize(arrLength, wordStr) {
  if (arrLength <= 1) return wordStr;
  return `${wordStr}s`;
}

/**
 * createHelperSentences
 *
 * function used to create helper sentences for tour steps.
 * @param {string} verbStr - the string that replaces the verb in each of the sentences
 * @param {string} extraClauseStr - the string that replaces the noun or action in each of the sentences
 */
export function createHelperSentences(verbStr, extraClauseStr) {
  return (
    <Typography variant="caption">
      This help / guide is designed to aide you in learning how to&nbsp;
      {verbStr}&nbsp;{extraClauseStr}&nbsp;. Feel free to restart the guide if
      necessary.
    </Typography>
  );
}
