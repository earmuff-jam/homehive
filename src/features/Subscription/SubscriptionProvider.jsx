import React from "react";

import { Navigate, useLocation } from "react-router-dom";

import dayjs from "dayjs";

import { Skeleton } from "@mui/material";
import {
  HomeRouteUri,
  SettingsRouteUri,
  fetchLoggedInUser,
} from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { Role } from "features/Auth/AuthHelper";

// SubscriptionProvider ...
export default function SubscriptionProvider({ children }) {
  const location = useLocation();
  const user = fetchLoggedInUser();

  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, { skip: !user?.uid });

  if (isUserDetailsLoading) return <Skeleton height="100%" />;

  // Always allow access to Settings page
  if (location.pathname === SettingsRouteUri) {
    return children;
  }

  // If no user, redirect home
  if (!userDetails?.uid) return <Navigate to={HomeRouteUri} replace />;

  const hasActiveSubscription =
    (userDetails?.stripeAccountIsActive &&
      userDetails?.isStripeSubscriptionActive) ||
    false;

  const withinTrialPeriod =
    dayjs().isBefore(dayjs(userDetails?.createdOn).add(7, "days")) || false;

  const isUserSubscriptionValid =
    userDetails?.role === Role.Admin ||
    withinTrialPeriod ||
    hasActiveSubscription;

  if (!isUserSubscriptionValid) {
    console.debug(
      "Invalid user subscription detected. Redirecting to Settings.",
    );
    return <Navigate to={SettingsRouteUri} replace />;
  }

  return children;
}
