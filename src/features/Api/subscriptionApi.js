import dayjs from "dayjs";

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["subscriptions"],
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
      providesTags: ["subscriptions"],
    }),
    // getLatestSubscriptionByEmail ...
    // defines a query function that returns the latest subscription details
    getLatestSubscriptionByEmail: builder.query({
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

          let latestSubscription = null;
          let isFirstSubscriptionForCustomer = true;

          if (subscriptions.length > 0) {
            isFirstSubscriptionForCustomer = false;
            latestSubscription = subscriptions.reduce((latest, current) => {
              return dayjs(current.updatedOn).isAfter(dayjs(latest.updatedOn))
                ? current
                : latest;
            }, subscriptions[0]);
          }

          return {
            data: { ...latestSubscription, isFirstSubscriptionForCustomer },
          };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["subscriptions"],
    }),
  }),
});

export const {
  useGetSubscriptionByEmailQuery,
  useGetLatestSubscriptionByEmailQuery,
} = subscriptionApi;
