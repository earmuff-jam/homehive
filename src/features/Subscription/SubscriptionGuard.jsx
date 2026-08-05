import React from "react";

import { Navigate } from "react-router-dom";

import { Skeleton } from "@mui/material";
import {
  HomeRouteUri,
  SettingsRouteUri,
  fetchLoggedInUser,
} from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetLatestSubscriptionByEmailQuery } from "features/Api/subscriptionApi";
import { useValidateSubscription } from "features/Subscription/useValidateSubscription";

export default function SubscriptionGuard({ children }) {
  const user = fetchLoggedInUser();

  const { data: userDetails, isFetching: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const {
    data: latestSubscription = {},
    isLoading: isSubscriptionDetailsLoading,
  } = useGetLatestSubscriptionByEmailQuery(user?.email, {
    skip: !user?.email,
  });

  const isSubscriptionValid = useValidateSubscription(
    latestSubscription || {},
    userDetails?.role,
    userDetails?.createdOn,
  );

  const isLoading = isUserDetailsLoading || isSubscriptionDetailsLoading;

  if (isLoading) return <Skeleton height="100%" />;

  if (!userDetails?.uid) {
    return <Navigate to={HomeRouteUri} replace />;
  }

  if (!isSubscriptionValid) {
    return <Navigate to={SettingsRouteUri} replace />;
  }

  return children;
}
