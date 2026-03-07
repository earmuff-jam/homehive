import React, { useMemo } from "react";

import { Navigate } from "react-router-dom";

import dayjs from "dayjs";

import { Skeleton } from "@mui/material";
import {
  HomeRouteUri,
  SettingsRouteUri,
  fetchLoggedInUser,
} from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetSubscriptionByEmailQuery } from "features/Api/subscriptionApi";
import { Role } from "features/Auth/AuthHelper";

export default function SubscriptionGuard({ children }) {
  const user = fetchLoggedInUser();

  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const { latestSubscription, isLoading: isSubscriptionDetailsLoading } =
    useGetSubscriptionByEmailQuery(user.email, {
      selectFromResult: ({ data }) => ({
        latestSubscription:
          data?.sort((a, b) => b.updatedOn - a.updatedOn)[0] ?? null,
      }),
    });

  const data = useMemo(() => {
    if (!isSubscriptionDetailsLoading && !isUserDetailsLoading) {
      return {
        ...latestSubscription,
        role: userDetails?.role,
      };
    }
  }, [isSubscriptionDetailsLoading, isUserDetailsLoading]);

  const isLoading = isUserDetailsLoading || isSubscriptionDetailsLoading;

  if (isLoading) return <Skeleton height="100%" />;

  if (!userDetails?.uid) {
    return <Navigate to={HomeRouteUri} replace />;
  }

  if (!validateSubscription(data)) {
    return <Navigate to={SettingsRouteUri} replace />;
  }

  return children;
}

// Stripe Payment Status Messages
export const StripePaymentStatusCompleted = "paid";

// validateSubscription ...
// defines a function that is used to validate an existing subscription
export const validateSubscription = (data) => {
  const hasActiveSubscription =
    data?.subscriptionStatus === StripePaymentStatusCompleted || false;

  const withinTrial = dayjs().isBefore(dayjs(data?.createdOn).add(7, "days"));

  const isValid =
    withinTrial || hasActiveSubscription || data?.role !== Role.Owner;

  return isValid;
};
