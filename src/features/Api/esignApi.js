import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { authenticatorFirestore as db, firebaseCloudStorage } from "src/config";

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
      providesTags: [EsignApiTagTypes.EsignPrefilledDocument],
    }),

    // createEsignDocument ...
    // defines a function that uploads pdf documents to storage and saves the metadata
    createEsignDocument: builder.mutation({
      async queryFn({
        file,
        path,
        fileId,
        fileName,
        userId,
        signers = [],
        fields = [],
        signatureBoxes = [],
        signingFormFields = [],
        createdAt,
        createdBy,
      }) {
        try {
          const storageRef = ref(firebaseCloudStorage, path);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          try {
            const docRef = doc(db, ESIGN_DB_NAME, fileId);
            await setDoc(
              docRef,
              {
                filePath: downloadURL,
                fileId: fileId,
                fileName: fileName,
                userId: userId,
                signers: signers,
                fields: fields,
                signatureBoxes: signatureBoxes,
                signingFormFields: signingFormFields,
                createdAt: createdAt,
                createdBy: createdBy,
              },
              { merge: true },
            );

            const result = {
              filePath: downloadURL,
              fileId: fileId,
              fileName: fileName,
              userId: userId,
              signers: signers,
              signatureBoxes: signatureBoxes,
              signingFormFields: signingFormFields,
              createdAt: createdAt,
              createdBy: createdBy,
            };

            return {
              data: result,
            };
          } catch (error) {
            return {
              error: {
                message: error.message,
                code: error.code,
              },
            };
          }
        } catch (error) {
          return {
            error: {
              message: error?.message ?? "Failed to upload pdf document",
              code: error.code,
            },
          };
        }
      },
      providesTags: [EsignApiTagTypes.EsignPrefilledDocument],
    }),
  }),
});

export const {
  useGetEtssTokensByEmailIdQuery,
  useGetEsignDocumentsByUserIdQuery,
  useCreateEsignDocumentMutation,
} = esignApi;
