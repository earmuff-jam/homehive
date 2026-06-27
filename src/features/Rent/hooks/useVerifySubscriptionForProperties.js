import dayjs from "dayjs";

import { Role } from "features/Auth/AuthHelper";
import { DefaultRentXPropertiesLimit } from "features/Rent/constants";

// useVerifySubscriptionForProperties ...
// defines a function that verifies the subscription details for the logged in user.
export const useVerifySubscriptionForProperties = (
  user,
  userCreatedOn,
  latestSubscription = {},
  subscriptionOptions = [],
  activePropertiesCount = 0,
) => {
  const userRole = user?.role || Role.User;

  if (userRole === Role.Admin) {
    return { canAddProperty: true, displayAlert: false };
  }

  if (userRole === Role.Tenant) {
    return { canAddProperty: false, displayAlert: false };
  }

  if (userRole === Role.Owner) {
    const selectedSubscription = subscriptionOptions?.find(
      (option) =>
        option.productName === latestSubscription?.subscriptionProductName,
    );

    // check if the user is within the trial period
    const withinTrial =
      latestSubscription?.isFirstSubscriptionForCustomer &&
      dayjs().isBefore(dayjs(userCreatedOn).add(7, "days"));

    if (withinTrial) {
      // should display the AlertBar to let users know they are within trial period.
      return { canAddProperty: activePropertiesCount < 1, displayAlert: true };
    }

    const allowedPropertiesLimit =
      DefaultRentXPropertiesLimit[selectedSubscription?.productName] || 0;

    return {
      canAddProperty: activePropertiesCount < allowedPropertiesLimit,
      displayAlert: false,
    };
  }

  return { canAddProperty: false, displayAlert: false };
};
