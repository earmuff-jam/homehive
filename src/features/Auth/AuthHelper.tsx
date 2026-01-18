import dayjs from "dayjs";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authenticatorApp } from "src/config";
import { TBaseAuthIdentity } from "src/types";

// TRole ...
export type TRole = (typeof Role)[keyof typeof Role];

export const Role = {
  User: "USER",
  Admin: "ADMIN",
  Tenant: "TENANT",
} as const;

// authenticateViaGoogle ...
// defines a function where user is authenticated
export const authenticateViaGoogle = async (): Promise<TBaseAuthIdentity> => {
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
