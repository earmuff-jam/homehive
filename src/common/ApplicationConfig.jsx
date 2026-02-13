import React from "react";

import { Route } from "react-router-dom";

import AuthenticationProvider from "features/Auth/AuthenticationProvider";

// authorizedServerLevelFeatureFlags ...
// defines a function that returns a map of all valid feature flags in the app
export function authorizedServerLevelFeatureFlags() {
  const invoicerAppAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS;
  const invoicerAppEnabled = import.meta.env.VITE_ENABLE_INVOICER;
  const invoicerAppProFeaturesEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_PRO;
  const invoicerAppUserInformationEnabled = import.meta.env
    .VITE_ENABLE_INVOICER_USER_INFORMATION;
  const invoicerAppSendEmailEnabled = import.meta.env.VITE_ENABLE_EMAIL_FEATURE;
  const isDevEnvironmentEnabled = import.meta.env.VITE_ENABLE_DEV_ENV;

  return new Map([
    ["analytics", invoicerAppAnalyticsEnabled === "true"],
    ["invoicer", invoicerAppEnabled === "true"],
    ["invoicerPro", invoicerAppProFeaturesEnabled === "true"],
    ["userInformation", invoicerAppUserInformationEnabled === "true"],
    ["sendEmail", invoicerAppSendEmailEnabled === "true"],
    ["devEnv", isDevEnvironmentEnabled === "true"],
  ]);
}

// isValidFeatureFlagsForRoutes ...
// defines a function that returns true or false based on authorized flags and perms
export function isValidFeatureFlagsForRoutes(
  validRouteFlags = [],
  requiredFlags = [],
) {
  const isRequired = requiredFlags?.every((routeFeature) => {
    return validRouteFlags?.get(routeFeature);
  });
  return isRequired;
}

// filterAuthorizedRoutesForNavBar ...
// defines a function that returns routes marked ok to display in navigation bar
export const filterAuthorizedRoutesForNavBar = (draftRoutes = []) => {
  if (!draftRoutes) return [];
  return draftRoutes.filter(({ config }) => Boolean(config.displayInNavBar));
};

// buildAppRoutes ...
// defines a function that returns routes that are authorized and valid
export function buildAppRoutes(draftRoutes = []) {
  const validRouteFlags = authorizedServerLevelFeatureFlags();

  return draftRoutes
    .map(({ path, element, requiredFlags = [], config = {} }) => {
      const isRouteValid = isValidFeatureFlagsForRoutes(
        validRouteFlags,
        requiredFlags,
      );
      if (!isRouteValid) return null;
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
