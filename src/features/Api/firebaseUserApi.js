import secureLocalStorage from "react-secure-storage";

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Role, authenticateViaGoogle } from "features/Auth/AuthHelper";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { authenticatorConfig, authenticatorFirestore as db } from "src/config";

export const firebaseUserApi = createApi({
  reducerPath: "firebaseUserApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // fetch user data where user id matches the passed in user id from users db
    getUserDataById: builder.query({
      async queryFn(uid) {
        try {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists())
            return { error: { message: "User not found" } };
          return { data: docSnap.data() };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["User"],
    }),
    // fetch user data by email address
    getUserByEmailAddress: builder.query({
      async queryFn(emailAddress) {
        try {
          const q = query(
            collection(db, "users"),
            where("emailAddress", "==", emailAddress),
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            return { data: null };
          }
          const userDoc = querySnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() };

          return { data: userData };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["tenants"],
    }),
    // create user in users db
    authenticate: builder.mutation({
      async queryFn() {
        try {
          const userDetails = await authenticateViaGoogle();
          const userRef = doc(db, "users", userDetails?.uid);
          await setDoc(userRef, { ...userDetails }, { merge: true });
          // refetch to get accurate roles
          const refetchUserDataSnapshot = await getDoc(userRef);
          const refetchUserData = refetchUserDataSnapshot.data();

          let userWithRole = {
            uid: userDetails?.uid,
            role: refetchUserData?.role,
            email: userDetails?.email,
          };

          // if the user has no roles, the user is a generic user
          // generic users can have associated invites.
          if (!Object.values(Role).includes(userWithRole.role)) {
            const inviteRef = doc(db, "invites", userDetails?.email);
            const inviteSnapshot = await getDoc(inviteRef);

            if (inviteSnapshot.exists()) {
              const invite = inviteSnapshot.data();
              // Create user from invite
              await setDoc(userRef, {
                uid: userDetails?.uid,
                email: userDetails.email,
                googleDisplayName: userDetails.displayName ?? null,
                googlePhotoURL: userDetails.photoURL ?? null,
                role: invite.role,
              });

              // remove invite doc if user is created
              await deleteDoc(inviteRef);
              return;
            }
          }

          secureLocalStorage.setItem("user", userWithRole);
          return { data: userWithRole };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),
    // update user in users db
    updateUserByUid: builder.mutation({
      async queryFn({ uid, newData }) {
        try {
          const userRef = doc(db, "users", uid);
          await setDoc(userRef, newData, { merge: true });
          return { data: newData };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),
    // log off users from the system
    logout: builder.mutation({
      async queryFn() {
        try {
          const auth = getAuth(authenticatorConfig);
          await signOut(auth);
          secureLocalStorage.removeItem("user");
          return { data: { success: true } };
        } catch (error) {
          /* eslint-disable no-console */
          console.error("Error signing out:", error);
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useLazyGetUserDataByIdQuery,
  useGetUserDataByIdQuery,
  useGetUserByEmailAddressQuery,
  useLazyGetUserByEmailAddressQuery,
  useAuthenticateMutation,
  useUpdateUserByUidMutation,
  useLogoutMutation,
} = firebaseUserApi;
