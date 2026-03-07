import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["subscription"],
  endpoints: (builder) => ({
    // getSubscriptionByEmail ...
    // defines a query function that returns subscription details
    getSubscriptionByEmail: builder.query({
      async queryFn(customerEmail) {
        try {
          const subscriptions = [];

          const q = query(
            collection(db, "subscriptionPayments"),
            where("stripeCustomerEmail", "==", customerEmail),
          );

          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            subscriptions.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          return { data: subscriptions };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["subscription"],
    }),
  }),
});

export const { useGetSubscriptionByEmailQuery } = subscriptionApi;
