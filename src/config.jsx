import secureLocalStorage from "react-secure-storage";

import { getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

// isFirebaseConfigOptionsValid ...
const isFirebaseConfigOptionsValid = ({ options }) =>
  options &&
  !Object.values(options).some((option) => option?.length === 0) &&
  typeof options?.apiKey === "string" &&
  typeof options?.authDomain === "string" &&
  typeof options?.projectId === "string";

// -------------------------------------------
// Analytics App
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

export const authenticatorConfig =
  getApps().find((app) => app.name === "AUTHENTICATOR") ||
  initializeApp(authenticatorFirebaseConfig, "AUTHENTICATOR");

// update user details only if auth config is valid based on auth state
if (isFirebaseConfigOptionsValid(authenticatorConfig)) {
  const auth = getAuth(authenticatorConfig);
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      secureLocalStorage.removeItem("user");
      return;
    }

    const email = user.email?.toLowerCase();
    const userRef = doc(authenticatorFirestore, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData.role) {
        secureLocalStorage.setItem("user", {
          uid: user.uid,
          role: userData.role,
          email: user.email,
        });
        return;
      }
    }

    // check invites if the user has any invites
    const inviteRef = doc(authenticatorFirestore, "invites", email);
    const inviteSnapshot = await getDoc(inviteRef);

    if (inviteSnapshot.exists()) {
      const invite = inviteSnapshot.data();
      // Create user from invite
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        googleDisplayName: user.displayName ?? null,
        googlePhotoURL: user.photoURL ?? null,
        role: invite.role,
      });

      // remove invite doc if user is created
      await deleteDoc(inviteRef);

      secureLocalStorage.setItem("user", {
        uid: user.uid,
        role: invite.role,
        email: user.email,
      });

      return;
    }

    // fallback; user is regarded as trial user
    secureLocalStorage.setItem("user", {
      uid: user.uid,
      email: user.email,
    });
  });
} else {
  /* eslint-disable no-console */
  console.error(
    "Invalid Firebase config. Auth state listener not initialized.",
  );
}

export const authenticatorApp = isFirebaseConfigOptionsValid(
  authenticatorConfig,
)
  ? getAuth(authenticatorConfig)
  : null;

export const authenticatorFirestore = getFirestore(authenticatorConfig);
