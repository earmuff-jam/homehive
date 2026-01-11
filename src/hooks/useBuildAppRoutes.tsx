import { Route } from "react-router-dom";

import rootLevelEnabledFeatures, { isValidPermissions } from "common/utils";
import AuthenticationProvider from "features/Auth/AuthenticationProvider";
import { TAppRoute } from "src/types";

// useBuildAppRoutes ...
export function useBuildAppRoutes(draftRoutes: TAppRoute[]) {
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
