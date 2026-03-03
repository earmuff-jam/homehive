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
import { Role } from "features/Auth/AuthHelper";

export const validateSubscription = (userDetails) => {
  const rentAppSubscription = userDetails?.subscriptionList?.find(
    (sl) => sl.title === "Rent App",
  );
  const hasActiveSubscription = rentAppSubscription?.isValid ?? false;
  const withinTrial = dayjs().isBefore(
    dayjs(userDetails?.createdOn).add(7, "days"),
  );
  const isValid =
    withinTrial ||
    hasActiveSubscription ||
    userDetails?.role === Role.Admin ||
    userDetails?.role === Role.Tenant;

  return isValid;
};

export default function SubscriptionGuard({ children }) {
  const user = fetchLoggedInUser();

  const { data: userDetails, isLoading } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  if (isLoading) return <Skeleton height="100%" />;

  if (!userDetails?.uid) {
    return <Navigate to={HomeRouteUri} replace />;
  }

  if (!validateSubscription(userDetails)) {
    return <Navigate to={SettingsRouteUri} replace />;
  }

  return children;
}
