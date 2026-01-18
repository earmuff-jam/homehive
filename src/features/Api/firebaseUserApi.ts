import secureLocalStorage from "react-secure-storage";

import {
  QueryReturnValue,
  createApi,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { authenticateViaGoogle } from "features/Auth/AuthHelper";
import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { authenticatorConfig, authenticatorFirestore as db } from "src/config";
import { TCustomError, TUser, TUserDetails } from "src/types";

// TTag ...
type TTag = "User";

// TTagTypes ...
export type TTagTypes = {
  User: TTag;
};

export const firebaseUserApiTagTypes: TTagTypes = {
  User: "User",
};

export const firebaseUserApi = createApi({
  reducerPath: "firebaseUserApi",
  baseQuery: fakeBaseQuery<TCustomError>(),
  tagTypes: [firebaseUserApiTagTypes.User],

  endpoints: (builder) => ({
    // fetch user data where user id matches the passed in user id from users db
    getUserDataById: builder.query<TUserDetails, string>({
      queryFn: async (
        uid,
      ): Promise<QueryReturnValue<TUserDetails, TCustomError>> => {
        try {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            return { error: { code: 500, message: "User not found" } };
          }

          return {
            data: { uid, ...docSnap.data() } as TUserDetails,
          };
        } catch (err) {
          return {
            error: {
              code: 500,
              message: err instanceof Error ? err.message : "Unknown error",
            },
          };
        }
      },
      providesTags: [firebaseUserApiTagTypes.User],
    }),

    // fetch user data by email address
    getUserByEmailAddress: builder.query<TUser | null, string>({
      queryFn: async (
        emailAddress,
      ): Promise<QueryReturnValue<TUser | null, TCustomError>> => {
        try {
          const q = query(
            collection(db, "users"),
            where("googleEmailAddress", "==", emailAddress),
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            return { data: null };
          }

          const userDoc = querySnapshot.docs[0];

          return {
            data: {
              uid: userDoc.id,
              ...userDoc.data(),
            } as TUser,
          };
        } catch (err) {
          return {
            error: {
              code: 500,
              message: err instanceof Error ? err.message : "Unknown error",
            },
          };
        }
      },
      providesTags: [firebaseUserApiTagTypes.User],
    }),

    // create user in users db
    authenticate: builder.mutation<TUser, void>({
      queryFn: async (): Promise<QueryReturnValue<TUser, TCustomError>> => {
        try {
          const userDetails = await authenticateViaGoogle();

          if (!userDetails?.uid) {
            return { error: { code: 500, message: "Authentication failed" } };
          }

          const userRef = doc(db, "users", userDetails.uid);

          await setDoc(userRef, { ...userDetails }, { merge: true });

          const snapshot = await getDoc(userRef);
          const userData = snapshot.data();

          secureLocalStorage.setItem("user", {
            uid: userDetails.uid,
            role: userData?.role,
            email: userDetails.email,
          });

          return {
            data: userDetails as TUser,
          };
        } catch (err) {
          return {
            error: {
              code: 500,
              message: err instanceof Error ? err.message : "Unknown error",
            },
          };
        }
      },
      invalidatesTags: [firebaseUserApiTagTypes.User],
    }),

    // update user in users db
    updateUserByUid: builder.mutation<
      TUserDetails,
      { uid: string; newData: Partial<TUserDetails> }
    >({
      queryFn: async ({
        uid,
        newData,
      }): Promise<QueryReturnValue<TUserDetails, TCustomError>> => {
        try {
          const userRef = doc(db, "users", uid);
          await setDoc(userRef, newData, { merge: true });

          return {
            data: { uid, ...newData } as TUserDetails,
          };
        } catch (err) {
          return {
            error: {
              code: 500,
              message: err instanceof Error ? err.message : "Unknown error",
            },
          };
        }
      },
      invalidatesTags: [firebaseUserApiTagTypes.User],
    }),

    // log off users from the system
    logout: builder.mutation<{ success: true }, void>({
      queryFn: async (): Promise<
        QueryReturnValue<{ success: true }, TCustomError>
      > => {
        try {
          const auth = getAuth(authenticatorConfig);
          await signOut(auth);
          secureLocalStorage.removeItem("user");

          return { data: { success: true } };
        } catch (err) {
          console.error("Error signing out:", err);
          return {
            error: {
              code: 500,
              message: err instanceof Error ? err.message : "Unknown error",
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
