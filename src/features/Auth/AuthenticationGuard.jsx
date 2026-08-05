import React from "react";

import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import { Skeleton } from "@mui/material";
import { HomeRouteUri, fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";

// AuthenticationGuard ...
export default function AuthenticationGuard({ children }) {
  const user = fetchLoggedInUser();

  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  if (isUserDetailsLoading) return <Skeleton height="100%" />;

  try {
    const userID = userDetails?.uid;
    // validate user id and role is not tampered
    if (userID != user?.uid || user?.role != userDetails?.role) {
      console.debug("Incorrect login detected");
      throw new Error("Incorrect login permission detected.");
    }
  } catch {
    console.debug("Unable to authenticate user");
    secureLocalStorage.removeItem("user");
    return <Navigate to={HomeRouteUri} replace />;
  }

  return children;
}
