import React from "react";

import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import { Skeleton } from "@mui/material";
import { HomeRouteUri, fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";

// AuthenticationGuard ...
export default function AuthenticationProvider({ children }) {
  const user = fetchLoggedInUser();
  const isPlaywrightTests =
    typeof window !== "undefined" && window.PLAYWRIGHT_ENV_ENABLED == "true";

  const shouldSkip = isPlaywrightTests || !user?.uid;
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: shouldSkip,
    });

  if (isUserDetailsLoading) return <Skeleton height="100%" />;

  try {
    if (!isPlaywrightTests) {
      const userID = userDetails?.uid;
      // validate user id and role is not tampered
      if (userID != user?.uid || user?.role != userDetails?.role) {
        throw new Error("Incorrect login permission detected.");
      }
    }
  } catch {
    secureLocalStorage.removeItem("user");
    return <Navigate to={HomeRouteUri} replace />;
  }

  return children;
}
