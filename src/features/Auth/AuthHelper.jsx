import dayjs from "dayjs";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authenticatorApp } from "src/config";

// Role ...
// defines a function that returns valid roles
export const Role = {
  User: "USER",
  Admin: "ADMIN",
  Owner: "OWNER",
  Tenant: "TENANT",
};

// authenticateViaGoogle ...
// defines a function that authenticates users
export const authenticateViaGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(authenticatorApp, provider);
  const user = result.user;
  const userDetails = {
    uid: user.uid,
    email: user.email,
    googleDisplayName: user.displayName,
    googlePhotoURL: user.photoURL,
    provider: user.providerData[0]?.providerId,
    googleAccountLinkedAt: dayjs().toISOString(),
    googleLastLoginAt: dayjs().toISOString(),
    createdOn: dayjs(Number(user.metadata.createdAt)).toISOString(),
    createdBy: user.uid,
  };

  return userDetails;
};

// setupStripe ...
// defines a function that allows the user to setup stripe services
export const setupStripe = async (email) => {
  try {
    console.debug("Attempting to create stripe customer for RentApp");
    const response = await fetch("/.netlify/functions/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fUrl: "0020_setup_stripe_for_customer",
        fMethod: "POST",
        payload: { email },
      }),
    });

    const data = await response.json();
    console.debug("Successfully created stripe customer account for RentApp");
    if (!response.ok)
      throw new Error(
        "Unable to create stripe customer account. Details: ",
        data?.error,
      );

    return data;
  } catch (err) {
    console.debug("Unable to setup stripe. Error: ", err);
    return null;
  }
};

// generateUserWithRoleShape ...
// defines a function that generates the shape for RentApp user with role
export const generateUserWithRoleShape = (userData) => {
  return {
    uid: userData?.uid,
    role: userData?.role,
    email: userData?.email,
  };
};
