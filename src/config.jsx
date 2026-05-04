import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// getEnv ...
// defines a function that is used to return configuration keys based on
// vite or node js process. This config is used to manage the playwright tests as well,
// which have their own environment.
const getEnv = (key) => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key];
  }
  // eslint-disable-next-line no-undef
  return process.env[key];
};

// analyticsFirebaseConfig ...
// configuration for analytics for homehive solution
const analyticsFirebaseConfig = {
  apiKey: getEnv("VITE_ANALYTICS_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_ANALYTICS_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_ANALYTICS_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_ANALYTICS_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_ANALYTICS_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_ANALYTICS_FIREBASE_APPID"),
  measurementId: getEnv("VITE_ANALYTICS_FIREBASE_MEASUREMENTID"),
};

// Initialize only if not already initialized
const analyticsConfig =
  getApps().find((app) => app.name === "[DEFAULT]") ||
  initializeApp(analyticsFirebaseConfig);

// analyticsFirestore ...
export const analyticsFirestore = getFirestore(analyticsConfig);

const authenticatorFirebaseConfig = {
  apiKey: getEnv("VITE_AUTH_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_AUTH_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_AUTH_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_AUTH_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_AUTH_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_AUTH_FIREBASE_APPID"),
  measurementId: getEnv("VITE_AUTH_FIREBASE_MEASUREMENTID"),
};

// GeneralUserConfigValues ...
export const GeneralUserConfigValues = {
  IsDevModeEnabled: getEnv("VITE_ENABLE_DEV_ENV"),
  ShouldUseEmulatorForTesting: getEnv("VITE_USE_FIREBASE_EMULATOR"),
};

// shouldUseEmulatorForTesting ...
export const shouldUseEmulatorForTesting =
  GeneralUserConfigValues.IsDevModeEnabled === "true" &&
  GeneralUserConfigValues.ShouldUseEmulatorForTesting === "true";

// authenticatorConfig ...
export const authenticatorConfig =
  getApps().find((app) => app.name === "AUTHENTICATOR") ||
  initializeApp(authenticatorFirebaseConfig, "AUTHENTICATOR");

// authenticatorApp ...
export const authenticatorApp = getAuth(authenticatorConfig);

// authenticatorFirestore ...
export const authenticatorFirestore = getFirestore(authenticatorConfig);

if (shouldUseEmulatorForTesting) {
  console.debug("Emulator connected for authenticator app");
  connectAuthEmulator(authenticatorApp, "http://127.0.0.1:9099");
  connectFirestoreEmulator(authenticatorFirestore, "127.0.0.1", 8080);
}
