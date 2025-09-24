import { Route } from "react-router-dom";

import AuthenticationProvider from "features/Auth/AuthenticationProvider";

// static fields for feature flags associations
const Analytics = "analytics";
const Invoicer = "invoicer";
const SendEmail = "sendEmail";
const InvoicerPro = "invoicerPro";
const UserInformation = "userInformation";

/**
 * enabledFeatureFlags ...
 *
 * provides a list of enabled feature flags.
 *
 * @returns Map of all enabled feature flags
 */
export default function enabledFeatureFlags() {
  const invoicerAppAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS;
  const invoicerAppEnabled = import.meta.env.VITE_ENABLE_INVOICER;
  const invoicerAppProFeaturesEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_PRO;
  const invoicerAppUserInformationEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_USER_INFORMATION;
  const invoicerAppSendEmailEnabled = import.meta.env.VITE_ENABLE_EMAIL_FEATURE;

  return new Map([
    [Analytics, invoicerAppAnalyticsEnabled === "true"],
    [Invoicer, invoicerAppEnabled === "true"],
    [InvoicerPro, invoicerAppProFeaturesEnabled === "true"],
    [UserInformation, invoicerAppUserInformationEnabled === "true"],
    [SendEmail, invoicerAppSendEmailEnabled === "true"],
  ]);
}

/**
 * isValidPermissions
 *
 * used to determine if a feature is available to the client or not
 *
 * @param {Array} validRouteFlags Array of string of valid routes that the user can work with
 * @param {Array} requiredFlags Array of string of required routes that the user needs to work with
 *
 * @returns boolean value of true / false based on if the user can access feature or not
 */
export function isValidPermissions(validRouteFlags = [], requiredFlags = []) {
  const isRequired = requiredFlags?.every((routeFeature) => {
    return validRouteFlags?.get(routeFeature);
  });

  return isRequired;
}

/**
 * isUserLoggedIn ...
 *
 * determines if the current user is logged in and / or if the user is of a
 * valid type. checks against the local storage only, does not attempt to
 * communicate with the backend jobs for this.
 *
 * @returns user || false
 */
export const isUserLoggedIn = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (currentUser?.uid) {
    return true;
  }
  return false;
};

/**
 * filterValidRoutesForNavigationBar
 *
 * function used to filter the valid routes for left side navigation bar.
 * @param {Array} draftRoutes - the array of routes that need to be filtered out based on the route config
 */
export const filterValidRoutesForNavigationBar = (draftRoutes = []) => {
  if (!draftRoutes) return [];
  return draftRoutes.filter(({ config }) => Boolean(config.displayInNavBar));
};

/**
 * buildAppRoutes
 *
 * Used to build application-level routes based on the passed-in available routes.
 * If all required orgs/flags are met, the route is created. Does not take user role
 * into account while building routes.
 *
 * @param {Array} draftRoutes - Array of draft routes within the application
 * @returns Array of <Route> elements
 */
export function buildAppRoutes(draftRoutes = [], roleType = "") {
  const validRouteFlags = enabledFeatureFlags();

  return draftRoutes
    .map(({ path, element, requiredFlags = [], config = {} }) => {
      const isRouteValid = isValidPermissions(validRouteFlags, requiredFlags);
      if (!isRouteValid) return null;

      // Check role access here
      const validRoles = config?.enabledForRoles || [];
      if (validRoles.length > 0 && !validRoles.includes(roleType)) {
        return null;
      }

      const requiresLogin = Boolean(config.isLoggedInFeature);

      const wrappedEl = requiresLogin ? (
        <AuthenticationProvider>{element}</AuthenticationProvider>
      ) : (
        element
      );

      return <Route key={path} path={path} element={wrappedEl} />;
    })
    .filter(Boolean);
}
