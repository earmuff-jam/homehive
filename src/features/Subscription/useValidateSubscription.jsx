import dayjs from "dayjs";

import { Role } from "features/Auth/AuthHelper";
import { StripePaymentStatusCompleted } from "features/Subscription/constants";

// useValidateSubscription ...
// defines a function that is used to validate an existing subscription
export const useValidateSubscription = (
  selectedSubscription = {},
  role = "",
  userCreatedOn,
) => {
  if (role === Role.Owner) {
    if (Object.keys(selectedSubscription).length <= 0) return false;

    const withinTrial =
      selectedSubscription?.isFirstSubscriptionForCustomer &&
      dayjs().isBefore(dayjs(userCreatedOn).add(7, "days"));

    if (
      !withinTrial &&
      (!selectedSubscription.subscriptionStatus ||
        !selectedSubscription.stripeSubscriptionId)
    ) {
      return false;
    }

    withinTrial &&
      console.debug("User subscription is within trial version of Rental App.");
    const isValid =
      withinTrial ||
      role !== Role.Owner ||
      selectedSubscription?.subscriptionStatus === StripePaymentStatusCompleted;
    return isValid;
  } else {
    return true;
  }
};
