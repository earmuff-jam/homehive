import React from "react";

import { Route } from "react-router-dom";

import AuthenticationProvider from "features/Auth/AuthenticationProvider";

/**
 * validateClientPermissions ...
 *
 * function that validates client permissions to view certain aspects of the application.
 * This is similar to feature flags or access control based on server location.
 *
 * @returns Map of all valid client permissions
 */
export default function validateClientPermissions() {
  const invoicerAppAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS;
  const invoicerAppEnabled = import.meta.env.VITE_ENABLE_INVOICER;
  const invoicerAppProFeaturesEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_PRO;
  const invoicerAppUserInformationEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_USER_INFORMATION;
  const invoicerAppSendEmailEnabled = import.meta.env.VITE_ENABLE_EMAIL_FEATURE;

  return new Map([
    ["analytics", invoicerAppAnalyticsEnabled === "true"],
    ["invoicer", invoicerAppEnabled === "true"],
    ["invoicerPro", invoicerAppProFeaturesEnabled === "true"],
    ["userInformation", invoicerAppUserInformationEnabled === "true"],
    ["sendEmail", invoicerAppSendEmailEnabled === "true"],
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
 * used to build application level routes based on the passed in available routes.
 * if all required Orgs are met and flags are on, said route is created.
 *
 * @param {Array} draftRoutes - array of draft routes that are within the application
 * @returns Array of Routes with the route element from react router dom.
 */

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
  const validRouteFlags = validateClientPermissions();

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
