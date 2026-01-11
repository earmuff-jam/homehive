import {
  QueryReturnValue,
  createApi,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { mapServiceApi } from "features/Api/mapServiceApi";
import { TProperty } from "features/Rent/Rent.types";
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
import { TCustomError } from "src/types";

// TPropertiesTag ...
type TPropertiesTag = "properties";

// TTagTypes ...
type TTagTypes = {
  Properties: TPropertiesTag;
};

const propertiesApiTagTypes: TTagTypes = {
  Properties: "properties",
};

export const propertiesApi = createApi({
  reducerPath: "propertiesApi",
  baseQuery: fakeBaseQuery<TCustomError>(),
  tagTypes: [propertiesApiTagTypes.Properties],
  endpoints: (builder) => ({
    // getPropertiesByPropertyId ...
    getPropertiesByPropertyId: builder.query<TProperty, string>({
      async queryFn(
        propertyId,
      ): Promise<QueryReturnValue<TProperty, TCustomError>> {
        try {
          const docRef = doc(db, "properties", propertyId);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists())
            return {
              error: {
                code: 404,
                message: "Property not found",
              },
            };

          return { data: { id: docSnap.id, ...docSnap.data() } as TProperty };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [propertiesApiTagTypes.Properties],
    }),

    // getPropertiesByUserId ...
    // retrives a list of properties created by user
    getPropertiesByUserId: builder.query<TProperty[], string>({
      async queryFn(
        userId,
      ): Promise<QueryReturnValue<TProperty[], TCustomError>> {
        try {
          const q = query(
            collection(db, "properties"),
            where("createdBy", "==", userId),
            where("isDeleted", "==", false),
          );
          const querySnapshot = await getDocs(q);
          const properties: TProperty[] = [];

          querySnapshot.forEach((doc) => {
            properties.push({ id: doc.id, ...doc.data() } as TProperty);
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
      providesTags: [propertiesApiTagTypes.Properties],
    }),

    // createProperty ...
    // also uses mapServiceApi for geolocation
    createProperty: builder.mutation<TProperty, TProperty>({
      async queryFn(
        property,
        { dispatch },
      ): Promise<QueryReturnValue<TProperty, TCustomError>> {
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

          const propertyWithCoordinates: TProperty = {
            ...property,
            location: result,
          };

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

    // updatePropertyById ...
    // also uses mapServiceApi for geolocation
    updatePropertyById: builder.mutation<TProperty, TProperty>({
      async queryFn(
        data,
        { dispatch },
      ): Promise<QueryReturnValue<TProperty, TCustomError>> {
        try {
          const addressDetails = [data?.address, data?.state, data?.zipcode]
            .filter(Boolean)
            .join(", ");

          const result = await dispatch(
            mapServiceApi.endpoints.getUserLatlon.initiate(addressDetails),
          ).unwrap();

          const updatedPropertyWithCoordinates: TProperty = {
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
          return { data: updatedPropertyWithCoordinates };
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
