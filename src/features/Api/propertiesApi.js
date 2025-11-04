import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

export const propertiesApi = createApi({
  reducerPath: "propertiesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["properties"],
  endpoints: (builder) => ({
    getPropertiesByPropertyId: builder.query({
      async queryFn(propertyId) {
        try {
          const docRef = doc(db, "properties", propertyId);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists())
            return { error: { message: "properties not found" } };
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
      providesTags: ["properties"],
    }),

    // retrieves a list of properties created by the
    // passed in userId; filters deleted properties
    getPropertiesByUserId: builder.query({
      async queryFn(userId) {
        try {
          const q = query(
            collection(db, "properties"),
            where("createdBy", "==", userId),
            where("isDeleted", "==", false),
          );
          const querySnapshot = await getDocs(q);
          const properties = [];
          querySnapshot.forEach((doc) => {
            properties.push({ id: doc.id, ...doc.data() });
          });
          return { data: properties };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["properties"],
    }),

    // creates a new property in the system
    createProperty: builder.mutation({
      async queryFn(property) {
        try {
          const userRef = doc(db, "properties", property.id);
          await setDoc(userRef, property, { merge: true });
          return { data: property };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["properties"],
    }),

    // updates a selected property by data
    updatePropertyById: builder.mutation({
      async queryFn(data) {
        try {
          const propertyRef = doc(db, "properties", data?.id);
          await setDoc(propertyRef, data, { merge: true });
          return { data };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["properties"],
    }),
  }),
});

export const {
  useGetPropertiesByPropertyIdQuery,
  useGetPropertiesByUserIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyByIdMutation,
} = propertiesApi;
