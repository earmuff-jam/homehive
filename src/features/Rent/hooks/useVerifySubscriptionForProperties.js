// AllowedPropertiesSubscription ...
import { Role } from "features/Auth/AuthHelper";

// defines the allowed properties for each of the associated plan
const AllowedPropertiesSubscription = {
  prod_ULLSTCXPNbCB1r: 2, // starter plan
  prod_ULLVYsSQ3f2VnB: 10, // professional plan
  prod_ULLWJBO7h4uOoG: 10000, // enterprise plan
};

// useVerifySubscriptionForProperties ...
// defines a function that verifies the subscription details for the logged in user.
export const useVerifySubscriptionForProperties = (
  user,
  latestSubscription = {},
  subscriptionOptions = [],
  activePropertiesCount = 0,
) => {
  const userRole = user?.role || Role.User;

  if (userRole === Role.Admin) {
    return true;
  }

  if (userRole === Role.Tenant) {
    return false;
  }

  if (userRole === Role.Owner) {
    const selectedSubscription = subscriptionOptions?.find(
      (option) =>
        option.productId === latestSubscription?.subscriptionProductId,
    );
    const allowedPropertiesLimit =
      AllowedPropertiesSubscription[selectedSubscription?.productId] || 0;

    return activePropertiesCount < allowedPropertiesLimit;
  }

  return false;
};
