import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { mapServiceApi } from "features/Api/mapServiceApi";
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
    // uses mapServiceApi to retrieve property location
    // and persist in the db to display in map
    createProperty: builder.mutation({
      async queryFn(property, { dispatch }) {
        try {
          const addressDetails = [
            property?.address,
            property?.state,
            property?.zipcode,
          ]
            .filter(Boolean)
            .join(", ");

          const result = await dispatch(
            mapServiceApi.endpoints.getUserLatlon.initiate(addressDetails),
          ).unwrap();

          const propertyWithCoordinates = { ...property, location: result };

          const userRef = doc(db, "properties", property.id);
          await setDoc(userRef, propertyWithCoordinates, { merge: true });
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
    // uses mapServiceApi to retrieve property location
    // and persist in the db to display in map
    updatePropertyById: builder.mutation({
      async queryFn(data, { dispatch }) {
        try {
          const addressDetails = [data?.address, data?.state, data?.zipcode]
            .filter(Boolean)
            .join(", ");

          const result = await dispatch(
            mapServiceApi.endpoints.getUserLatlon.initiate(addressDetails),
          ).unwrap();

          const updatedPropertyWithCoordinates = {
            ...data,
            location: result,
          };

          const propertyRef = doc(
            db,
            "properties",
            updatedPropertyWithCoordinates?.id,
          );
          await setDoc(propertyRef, updatedPropertyWithCoordinates, {
            merge: true,
          });
          return { updatedPropertyWithCoordinates };
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
