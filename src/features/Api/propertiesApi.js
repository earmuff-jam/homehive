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

// PropertiesApiTagTypes ...
// used to define the tag types for maintenance api
const PropertiesApiTagTypes = {
  getProperties: "properties/getProperties",
  getPropertyAmenities: "properties/getPropertyAmenities",
};

export const propertiesApi = createApi({
  reducerPath: "propertiesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(PropertiesApiTagTypes),
  endpoints: (builder) => ({
    // fetchAdditionalAmenities
    // defines a function that retrieves additional amenities for property id
    fetchAdditionalAmenities: builder.query({
      async queryFn(propertyId) {
        try {
          const q = query(
            collection(db, "propertyAmenities"),
            where("propertyId", "==", propertyId),
          );
          const querySnapshot = await getDocs(q);

          let propertyAmenities = null;
          querySnapshot.forEach((doc) => {
            propertyAmenities = { id: doc.id, ...doc.data() };
          });

          return { data: propertyAmenities };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [PropertiesApiTagTypes.getPropertyAmenities],
    }),
    // saveAmenitiesForProperty ...
    // defines a function that saves the property amenities for a selected property id
    saveAmenitiesForProperty: builder.mutation({
      async queryFn(data) {
        try {
          const propertyIdRef = doc(db, "propertyAmenities", data.propertyId);
          await setDoc(propertyIdRef, data, { merge: true });
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
      invalidatesTags: [PropertiesApiTagTypes.getPropertyAmenities],
    }),
    // getPropertiesByPropertyId ...
    // defines a function that retrieves properties by id
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
      providesTags: [PropertiesApiTagTypes.getProperties],
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
      providesTags: [PropertiesApiTagTypes.getProperties],
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
      invalidatesTags: [PropertiesApiTagTypes.getProperties],
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
      invalidatesTags: [PropertiesApiTagTypes.getProperties],
    }),
    // deletePropertyById ...
    // defines a function that marks a property as deleted
    // also marks all associated tenants are inactive
    deletePropertyById: builder.mutation({
      async queryFn(property) {
        try {
          const propertyRef = doc(db, "properties", property?.id);
          await setDoc(
            propertyRef,
            {
              ...property,
              rentees: [], // remove tenant association
            },
            {
              merge: true,
            },
          );

          const associatedTenants = property?.rentees;
          const draftQuery = query(
            collection(db, "tenants"),
            where("propertyId", "==", property?.id),
            where("email", "in", associatedTenants),
          );

          const associatedTenantsDetailsSnapshot = await getDocs(draftQuery);

          // set all tenants to inactive
          associatedTenantsDetailsSnapshot?.forEach(
            async (associatedTenant) => {
              const tenantRef = doc(db, "tenants", associatedTenant.id);
              await setDoc(
                tenantRef,
                {
                  isActive: false,
                  moveOutDate: property?.updatedOn, // same as when the property was marked removed
                  updatedBy: property?.updatedBy,
                  updatedOn: property?.updatedOn,
                },
                { merge: true },
              );
            },
          );

          return { property };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [
        PropertiesApiTagTypes.getProperties,
        PropertiesApiTagTypes.getPropertyAmenities,
      ],
    }),
  }),
});

export const {
  useFetchAdditionalAmenitiesQuery,
  useSaveAmenitiesForPropertyMutation,
  useGetPropertiesByPropertyIdQuery,
  useGetPropertiesByUserIdQuery,
  useCreatePropertyMutation,
  useDeletePropertyByIdMutation,
  useUpdatePropertyByIdMutation,
} = propertiesApi;
