import React from "react";

import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import { Skeleton } from "@mui/material";
import { HomeRouteUri } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { fetchLoggedInUser } from "features/Rent/utils";

/**
 * AuthenticationProvider ...
 *
 * Provider Component that allows only logged in users to persist
 * in the page.
 * @param {children} Children - the children component to render
 */
export default function AuthenticationProvider({ children }) {
  const user = fetchLoggedInUser();
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  if (isUserDetailsLoading) return <Skeleton height="100%" />;

  try {
    const userID = userDetails?.uid;
    if (userID != user?.uid) {
      throw new Error("Incorrect login permission detected.");
    }
  } catch {
    secureLocalStorage.removeItem("user");
    return <Navigate to={HomeRouteUri} replace />;
  }

  return userDetails?.uid ? children : <Navigate to={HomeRouteUri} replace />;
}
