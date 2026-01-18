import {
  filterValidRoutesForNavigationBar,
  isValidPermissions,
} from "common/utils";
import { TAppRoute, TUser } from "src/types";

// getValidRoutes ...
// defines a function that is used to return valid navigation routes
export const getValidRoutes = (
  routes: TAppRoute[] = [],
  enabledFeatures: Map<string, boolean>,
  user: TUser,
): TAppRoute[] => {
  const filteredNavigationRoutes = filterValidRoutesForNavigationBar(routes);

  return filteredNavigationRoutes.filter(({ requiredFlags, config }) => {
    const isRouteValid = isValidPermissions(enabledFeatures, requiredFlags);
    if (!isRouteValid) return false;

    const requiresLogin = Boolean(config?.isLoggedInFeature);
    if (requiresLogin && !user?.uid) return false;

    return true;
  });
};
