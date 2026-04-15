import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

// EtssTokenPaymentsApiTagTypes ...
const EtssTokenPaymentsApiTagTypes = {
  GetEtssPayments: "get-etss-payments",
};

export const etssTokenApi = createApi({
  reducerPath: "etssTokenApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(EtssTokenPaymentsApiTagTypes),
  endpoints: (builder) => ({
    // getEtssTokensByEmailId ...
    // get ETSS tokens for a specific user
    getEtssTokensByEmailId: builder.query({
      async queryFn(emailAddress) {
        try {
          const q = query(
            collection(db, "etssPayments"),
            where("stripeCustomerEmail", "==", emailAddress),
            where("status", "==", "complete"), // only return fully paid tokens
          );

          const querySnapshot = await getDocs(q);

          const etssPayments = [];
          querySnapshot.forEach((doc) => {
            etssPayments.push({ id: doc.id, ...doc.data() });
          });

          // always calculate remaining token
          const validTokens = etssPayments?.reduce(
            (acc, el) =>
              acc +
              (Number(el?.tokens) || 0) -
              (Number(el?.consumedTokens) || 0),
            0,
          );

          return { data: validTokens ?? 0 };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [EtssTokenPaymentsApiTagTypes.GetEtssPayments],
    }),
  }),
});

export const { useGetEtssTokensByEmailIdQuery } = etssTokenApi;
