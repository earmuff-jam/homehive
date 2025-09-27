import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// -------------------------------------------
// Util functions

/**
 * isFirebaseConfigOptionsValid ...
 *
 * function is used to check if the passed in configuration for the authenticator app
 * is valid or not. Can be used to validate others.
 *
 * @param {Object} ConfigOptions - FirebaseConfig app
 * @returns boolean - true or false
 */
const isFirebaseConfigOptionsValid = ({ options }) =>
  options &&
  !Object.values(options).some((option) => option.length === 0) &&
  typeof options?.apiKey === "string" &&
  typeof options?.authDomain === "string" &&
  typeof options?.projectId === "string";

// -------------------------------------------
// Analytics App
const analyticsFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

// Initialize only if not already initialized
const analyticsConfig =
  getApps().find((app) => app.name === "[DEFAULT]") ||
  initializeApp(analyticsFirebaseConfig);

/**
 * analyticsFirestore ...
 *
 * the db used to store analytics events for the application
 */
export const analyticsFirestore = getFirestore(analyticsConfig);

// -------------------------------------------
// Authenticator App
const authenticatorFirebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AUTH_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_AUTH_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_AUTH_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_AUTH_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_AUTH_FIREBASE_MEASUREMENTID,
};

/**
 * GeneralUserConfigValues ...
 *
 * these are general configuration values that can be used in the application.
 */
export const GeneralUserConfigValues = {
  StripeConnectionInstructionsLink: import.meta.env
    .VITE_AUTH_STRIPE_CONNECTION_INSTRUCTIONS,
  StripeConnectionIssuesInstructionLink: import.meta.env
    .VITE_AUTH_STRIPE_CONNECTION_ISSUES_INSTRUCTIONS,
  StripSecurityAndComplianceInstructionLink: import.meta.env
    .VITE_AUTH_STRIPE_SECURITY_AND_COMPLIANCE,
};

/**
 * authenticatorConfig ...
 *
 * authenticatorConfig is the configuration manager used to authenticate
 * users into the backend system.
 *
 */
export const authenticatorConfig =
  getApps().find((app) => app.name === "AUTHENTICATOR") ||
  initializeApp(authenticatorFirebaseConfig, "AUTHENTICATOR");

// update user details only if auth config is valid based on auth state
if (isFirebaseConfigOptionsValid(authenticatorConfig)) {
  const auth = getAuth(authenticatorConfig);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // during refresh, we persist the role and attach it back
      const draftUser = JSON.parse(localStorage.getItem("user"));
      if (draftUser) {
        localStorage.setItem(
          "user",

          JSON.stringify({
            uid: user.uid,
            role: draftUser?.role,
            googleEmailAddress: draftUser?.googleEmailAddress,
          }),
        );
      } else {
        // if the role is not found yet, do nothing
        localStorage.setItem("user", JSON.stringify({ uid: user?.uid }));
      }
    } else {
      localStorage.removeItem("user");
    }
  });
} else {
  /* eslint-disable no-console */
  console.error(
    "Invalid Firebase config. Auth state listener not initialized.",
  );
}

/**
 * authenticatorApp ...
 *
 * the authenticator for the db
 */
export const authenticatorApp = isFirebaseConfigOptionsValid(
  authenticatorConfig,
)
  ? getAuth(authenticatorConfig)
  : null;

/**
 * authenticatedFirestore ...
 *
 * the db for all authenticated users
 */
export const authenticatorFirestore = getFirestore(authenticatorConfig);
