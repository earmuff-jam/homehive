import React from "react";

import { Navigate } from "react-router-dom";

import dayjs from "dayjs";

import { Skeleton } from "@mui/material";
import {
  HomeRouteUri,
  SettingsRouteUri,
  fetchLoggedInUser,
} from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetLatestSubscriptionByEmailQuery } from "features/Api/subscriptionApi";
import { Role } from "features/Auth/AuthHelper";

// Stripe Payment Status Messages
export const StripePaymentStatusCompleted = "paid";

export default function SubscriptionGuard({ children }) {
  const user = fetchLoggedInUser();

  const { data: userDetails, isFetching: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const {
    data: latestSubscription = {},
    isLoading: isSubscriptionDetailsLoading,
  } = useGetLatestSubscriptionByEmailQuery(user.email, {
    skip: !user?.email,
  });

  const isLoading = isUserDetailsLoading || isSubscriptionDetailsLoading;

  if (isLoading) return <Skeleton height="100%" />;

  if (!userDetails?.uid) {
    return <Navigate to={HomeRouteUri} replace />;
  }

  if (
    !validateSubscription(
      latestSubscription,
      userDetails?.role,
      userDetails?.createdOn,
    )
  ) {
    return <Navigate to={SettingsRouteUri} replace />;
  }

  return children;
}

// validateSubscription ...
// defines a function that is used to validate an existing subscription
export const validateSubscription = (
  selectedSubscription = {},
  role = "",
  userCreatedOn,
) => {
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

  withinTrial && console.debug("User subscription is within grace period.");
  const isValid =
    withinTrial ||
    role !== Role.Owner ||
    selectedSubscription?.subscriptionStatus === StripePaymentStatusCompleted;
  return isValid;
};
