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
  };

  return userDetails;
};
