import React from "react";

import secureLocalStorage from "react-secure-storage";

import { Skeleton } from "@mui/material";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { AuthContext } from "features/Auth/AuthenticationContext";

// FirebaseAuthProvider ...
// defines the authentication provider via firebase
export default function FirebaseAuthProvider({ children }) {
  const user = fetchLoggedInUser();

  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  if (isUserDetailsLoading) return <Skeleton height="100%" />;

  let authenticatedUser = null;

  try {
    const userID = userDetails?.uid;
    // verify user details against db
    if (userID != user?.uid || user?.role != userDetails?.role) {
      throw new Error("Incorrect login permission detected.");
    } else {
      authenticatedUser = {
        uid: userDetails?.uid,
        role: userDetails?.role,
        email: userDetails?.email,
        loading: false,
      };
    }
  } catch {
    secureLocalStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={authenticatedUser}>
      {children}
    </AuthContext.Provider>
  );
}
