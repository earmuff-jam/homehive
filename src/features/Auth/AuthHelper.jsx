import dayjs from "dayjs";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authenticatorApp } from "src/config";

/**
 * Role ...
 *
 * web roles and permissions
 */
export const Role = {
  User: "USER",
  Admin: "ADMIN",
  Tenant: "TENANT",
};

/**
 * authenticateViaGoogle...
 *
 * function used to login to google.
 * @returns {Object} userDetails
 */
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
