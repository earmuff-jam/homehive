import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// isFirebaseConfigOptionsValid ...
const isFirebaseConfigOptionsValid = ({ options }) =>
  options &&
  !Object.values(options).some((option) => option?.length === 0) &&
  typeof options?.apiKey === "string" &&
  typeof options?.authDomain === "string" &&
  typeof options?.projectId === "string";

const analyticsFirebaseConfig = {
  apiKey: import.meta.env.VITE_ANALYTICS_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_ANALYTICS_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_ANALYTICS_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_ANALYTICS_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env
    .VITE_ANALYTICS_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_ANALYTICS_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_ANALYTICS_FIREBASE_MEASUREMENTID,
};

// Initialize only if not already initialized
const analyticsConfig =
  getApps().find((app) => app.name === "[DEFAULT]") ||
  initializeApp(analyticsFirebaseConfig);

// analyticsFirestore ...
export const analyticsFirestore = getFirestore(analyticsConfig);

const authenticatorFirebaseConfig = {
  apiKey: import.meta.env.VITE_AUTH_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AUTH_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_AUTH_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_AUTH_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_AUTH_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_AUTH_FIREBASE_MEASUREMENTID,
};

// GeneralUserConfigValues ...
export const GeneralUserConfigValues = {
  StripeConnectionInstructionsLink: import.meta.env
    .VITE_AUTH_STRIPE_CONNECTION_INSTRUCTIONS,
  StripeConnectionIssuesInstructionLink: import.meta.env
    .VITE_AUTH_STRIPE_CONNECTION_ISSUES_INSTRUCTIONS,
  StripSecurityAndComplianceInstructionLink: import.meta.env
    .VITE_AUTH_STRIPE_SECURITY_AND_COMPLIANCE,
};

// authenticatorConfig ...
export const authenticatorConfig =
  getApps().find((app) => app.name === "AUTHENTICATOR") ||
  initializeApp(authenticatorFirebaseConfig, "AUTHENTICATOR");

// authenticatorApp ...
export const authenticatorApp = isFirebaseConfigOptionsValid(
  authenticatorConfig,
)
  ? getAuth(authenticatorConfig)
  : null;

// authenticatorFirestore ...
export const authenticatorFirestore = getFirestore(authenticatorConfig);
