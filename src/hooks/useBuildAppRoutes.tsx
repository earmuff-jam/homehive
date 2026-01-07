import { Route } from "react-router-dom";

import { TAppRoute } from "common/types";
import rootLevelEnabledFeatures, { isValidPermissions } from "common/utils";
import AuthenticationProvider from "features/Auth/AuthenticationProvider";

// buildAppRoutes ...
export function buildAppRoutes(draftRoutes: TAppRoute[]) {
  const enabledFeatures = rootLevelEnabledFeatures();

  return draftRoutes
    .map(({ path, element, requiredFlags = [], config = {} }) => {
      const isRouteValid = isValidPermissions(enabledFeatures, requiredFlags);
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
