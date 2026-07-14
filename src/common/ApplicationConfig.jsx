import React from "react";

import { Route } from "react-router-dom";

import AuthenticationGuard from "features/Auth/AuthenticationGuard";
import SubscriptionGuard from "features/Subscription/SubscriptionGuard";

// authorizedServerLevelFeatureFlags ...
// defines a function that returns a map of all valid feature flags in the app
export function authorizedServerLevelFeatureFlags() {
  const analyticsFeatureFlag = import.meta.env.VITE_ENABLE_ANALYTICS;
  const invoicerFeatureFlag = import.meta.env.VITE_ENABLE_INVOICER;
  const esignFeatureFlag = import.meta.env.VITE_ENABLE_ESIGN;
  const emailServiceFeatureFlag = import.meta.env.VITE_ENABLE_EMAIL_FEATURE;
  const cloudServiceFeatureFlag = import.meta.env.VITE_ENABLE_CLOUD_SERVICE;

  return new Map([
    ["analytics", analyticsFeatureFlag === "true"],
    ["invoicer", invoicerFeatureFlag === "true"],
    ["esign", esignFeatureFlag === "true"],
    ["sendEmail", emailServiceFeatureFlag === "true"],
    ["cloudService", cloudServiceFeatureFlag === "true"],
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
      const requiresSubscription = Boolean(
        config.isProtectedBySubscriptionGuard,
      );

      const wrappedEl = requiresLogin ? (
        <AuthenticationGuard>
          {requiresSubscription ? (
            <SubscriptionGuard>{element}</SubscriptionGuard>
          ) : (
            element
          )}
        </AuthenticationGuard>
      ) : (
        element
      );

      return <Route key={path} path={path} element={wrappedEl} />;
    })
    .filter(Boolean);
}
