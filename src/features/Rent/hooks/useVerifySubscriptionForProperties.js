// AllowedPropertiesSubscription ...
// defines the allowed properties for each of the associated plan
const AllowedPropertiesSubscription = {
  "Monthly Plan": 2,
  "Yearly Plan": 10,
};

// useVerifySubscriptionForProperties ...
// defines a function that verifies the subscription details for the property owner
// used ONLY TO limit the number of properties the owner can create
export const useVerifySubscriptionForProperties = (
  latestSubscription = {},
  activePropertiesCount = 0,
) => {
  const allowedPropertiesLimit =
    AllowedPropertiesSubscription[
      latestSubscription?.subscriptionProductName
    ] || 0;

  if (activePropertiesCount >= allowedPropertiesLimit) {
    return false;
  } else {
    return true;
  }
};
