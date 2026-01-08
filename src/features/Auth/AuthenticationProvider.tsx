import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

import { Skeleton } from "@mui/material";
import { HomeRouteUri, fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { TUser } from "src/types";

export default function AuthenticationProvider({ children }) {
  const user: TUser = fetchLoggedInUser();
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  if (isUserDetailsLoading) return <Skeleton height="100%" />;

  try {
    const userID = userDetails?.uid;
    if (userID != user?.uid || user?.role != userDetails?.role) {
      throw new Error("Incorrect login permission detected.");
    }
  } catch {
    secureLocalStorage.removeItem("user");
    return <Navigate to={HomeRouteUri} replace />;
  }

  return userDetails?.uid ? children : <Navigate to={HomeRouteUri} replace />;
}
