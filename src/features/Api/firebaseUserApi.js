import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { authenticateViaGoogle } from "features/Auth/AuthHelper";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

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
    // create user in users db
    authenticate: builder.mutation({
      async queryFn(role) {
        try {
          const userDetails = await authenticateViaGoogle();
          const userRef = doc(db, "users", userDetails?.uid);
          await setDoc(userRef, { ...userDetails, role }, { merge: true });
          if (userDetails?.uid) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                uid: userDetails?.uid,
                googleEmailAddress: userDetails?.googleEmailAddress,
                role,
              }),
            );
          }
          return { data: userDetails };
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
  }),
});

export const {
  useGetUserDataByIdQuery,
  useAuthenticateMutation,
  useUpdateUserByUidMutation,
  useLazyGetUserDataByIdQuery,
} = firebaseUserApi;
