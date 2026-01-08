import {
  QueryReturnValue,
  createApi,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { parseJsonUtility } from "common/utils";
import { mapServiceApi } from "features/Api/mapServiceApi";
import { PropertySchema } from "features/Rent/Rent.schema";
import {
  TProperty,
  TPropertyUpdateApiRequest,
  TTemplateObject,
} from "features/Rent/Rent.types";
import { DefaultTemplateData } from "features/Rent/components/Templates/constants";
import {
  DeletePropertyApiRequestEnumValue,
  UpdatePropertyApiRequestEnumValue,
} from "features/Rent/utils";
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
    // getTemplatesForPropertyId ...
    // defines a function that returns templates for each quick action
    getTemplatesForPropertyId: builder.query<TTemplateObject, void>({
      async queryFn(): Promise<
        QueryReturnValue<TTemplateObject, TCustomError>
      > {
        try {
          let propertyOwnerTemplates = parseJsonUtility<TTemplateObject>(
            localStorage.getItem("templates"),
          ) as TTemplateObject;

          if (
            !propertyOwnerTemplates ||
            Object.keys(propertyOwnerTemplates).length === 0
          ) {
            propertyOwnerTemplates = DefaultTemplateData;
          }

          return {
            data: propertyOwnerTemplates,
          };
        } catch (err) {
          return { error: err };
        }
      },
    }),
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

          const parsedProperty = PropertySchema.parse({
            id: docSnap.id,
            ...docSnap.data(),
          });

          return { data: parsedProperty };
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
      invalidatesTags: [propertiesApiTagTypes.Properties],
    }),

    // updatePropertyById ...
    // also uses mapServiceApi for geolocation
    updatePropertyById: builder.mutation<TProperty, TPropertyUpdateApiRequest>({
      async queryFn({ property, action }, { dispatch }) {
        try {
          if (action === DeletePropertyApiRequestEnumValue) {
            // handle remove property
            const propertyRef = doc(db, "properties", property?.id);
            await setDoc(propertyRef, property, {
              merge: true,
            });

            return { data: null };
          } else if (action === UpdatePropertyApiRequestEnumValue) {
            const addressDetails = [
              property.address,
              property.state,
              property.zipcode,
            ]
              .filter(Boolean)
              .join(", ");

            const result = await dispatch(
              mapServiceApi.endpoints.getUserLatlon.initiate(addressDetails),
            ).unwrap();

            const updatedPropertyWithCoordinates = {
              ...property,
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
            return { data: property } as { data: TProperty };
          } else {
            // do nothing
            console.error("no action found to perform on selected property.");
            return { data: null };
          }
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [propertiesApiTagTypes.Properties],
    }),
  }),
});

export const {
  useGetTemplatesForPropertyIdQuery,
  useGetPropertiesByPropertyIdQuery,
  useGetPropertiesByUserIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyByIdMutation,
} = propertiesApi;
