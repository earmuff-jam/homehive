import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

const ESIGN_DB_NAME = "esign";
const ESIGN_PAYMENTS_DB_NAME = "etssPayments";

// EsignApiTagTypes ...
const EsignApiTagTypes = {
  EsignTokenPayments: "esign/etss-token-payments",
  EsignPrefilledDocument: "esign/prefilled-document",
};

export const esignApi = createApi({
  reducerPath: "esignApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(EsignApiTagTypes),
  endpoints: (builder) => ({
    // getEtssTokensByEmailId ...
    // get ETSS tokens for a specific user
    getEtssTokensByEmailId: builder.query({
      async queryFn(emailAddress) {
        try {
          const q = query(
            collection(db, ESIGN_PAYMENTS_DB_NAME),
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
      providesTags: [EsignApiTagTypes.EsignTokenPayments],
    }),

    // getEsignDocumentsByUserId ...
    // get esign documents in list created by the user
    getEsignDocumentsByUserId: builder.query({
      async queryFn(uid) {
        try {
          const q = query(
            collection(db, ESIGN_DB_NAME),
            where("createdBy", "==", uid),
          );
          const querySnapshot = await getDocs(q);
          const esignDocuments = [];
          querySnapshot.forEach((doc) => {
            esignDocuments.push({ id: doc.id, ...doc.data() });
          });
          return { data: esignDocuments };
        } catch (error) {
          return {
            error: {
              code: error.code,
              message: error.message,
            },
          };
        }
      },
      invalidatesTags: [EsignApiTagTypes.EsignPrefilledDocument],
    }),

    // createEsignDocument ...
    // defines a mutation that saves the esign template
    createEsignDocument: builder.mutation({
      async queryFn(data) {
        try {
          const docRef = doc(db, ESIGN_DB_NAME, data?.id);
          await setDoc(docRef, data);
          return { data: data };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [EsignApiTagTypes.EsignPrefilledDocument],
    }),
  }),
});

export const {
  useGetEtssTokensByEmailIdQuery,
  useGetEsignDocumentsByUserIdQuery,
  useCreateEsignDocumentMutation,
} = esignApi;
