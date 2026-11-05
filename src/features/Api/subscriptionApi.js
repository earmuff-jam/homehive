import dayjs from "dayjs";

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

// SubscriptionApiTagTypes ...
const SubscriptionApiTagTypes = {
  Subscriptions: "subscriptions",
  LatestSubscription: "latestSubscription",
};

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(SubscriptionApiTagTypes),
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
      providesTags: [SubscriptionApiTagTypes.Subscriptions],
    }),
    // getLatestSubscriptionByEmail ...
    // defines a query function that returns the latest subscription details
    // only returns isFirstSubscriptionForCustomer = true if Admin role exists
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
              return dayjs(current.createdOn).isAfter(dayjs(latest.createdOn))
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
      invalidatesTags: [SubscriptionApiTagTypes.LatestSubscription],
    }),
  }),
});

export const {
  useGetSubscriptionByEmailQuery,
  useGetLatestSubscriptionByEmailQuery,
} = subscriptionApi;
