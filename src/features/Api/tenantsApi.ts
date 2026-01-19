import {
  QueryReturnValue,
  createApi,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { Role } from "features/Auth/AuthHelper";
import { TProperty, TTenant } from "features/Rent/Rent.schema";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";
import { TCustomError } from "src/types";

// TTenantsTag ...
type TTenantsTag = "tenants";
// TPropertiesTag ...
type TPropertiesTag = "properties";

// TTagTypes ...
type TTagTypes = {
  Tenants: TTenantsTag;
  Properties: TPropertiesTag;
};

// TUpdateTenantByIdArgs ...
export type TUpdateTenantByIdArgs = {
  id: string;
  newData: Partial<TTenant>;
};

// TUpdateTenantByEmailArgs ...
export type TUpdateTenantByEmailArgs = {
  email: string;
  newData: Partial<TTenant>;
};

// TAssociateTenantArgs ...
export type TAssociateTenantArgs = {
  draftData: TTenant;
  property: TProperty;
};

const tenantsApiTagTypes: TTagTypes = {
  Tenants: "tenants",
  Properties: "properties",
};

export const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  baseQuery: fakeBaseQuery<TCustomError>(),
  tagTypes: [tenantsApiTagTypes.Tenants, tenantsApiTagTypes.Properties],
  endpoints: (builder) => ({
    // getTenantList ...
    // defines a function to retrieve a list of tenants
    getTenantList: builder.query<TTenant[], boolean>({
      async queryFn(
        isActive: boolean = true,
      ): Promise<QueryReturnValue<TTenant[], TCustomError>> {
        try {
          const q = query(
            collection(db, "tenants"),
            where("isActive", "==", isActive),
          );

          const querySnapshot = await getDocs(q);

          const uniqueTenants: TTenant[] = [];
          const foundEmailAddress = new Set<string>();

          querySnapshot.forEach((doc) => {
            const data = doc.data() as TTenant;
            if (!foundEmailAddress.has(data.email)) {
              foundEmailAddress.add(data.email);
              uniqueTenants.push({ id: doc.id, ...data });
            }
          });

          return { data: uniqueTenants };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [tenantsApiTagTypes.Tenants],
    }),

    // getActiveTenantsByEmailAddress ...
    // defines a function to retrieve an active tenant
    getActiveTenantsByEmailAddress: builder.query<TTenant, string>({
      async queryFn(email): Promise<QueryReturnValue<TTenant, TCustomError>> {
        try {
          const q = query(
            collection(db, "tenants"),
            where("email", "==", email),
            where("isActive", "==", true),
          );

          const tenants: TTenant[] = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const tenant = { id: doc.id, ...doc.data() } as TTenant;
            tenants.push(tenant);
          });

          // 1 active tenant per property is allowed
          const currentTenant = tenants.find((tenant) => tenant.isActive);
          return { data: currentTenant };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [tenantsApiTagTypes.Tenants],
    }),

    // createTenant ...
    // defines a function to create a new tenant
    createTenant: builder.mutation<TTenant, TTenant>({
      async queryFn(
        tenant: TTenant,
      ): Promise<QueryReturnValue<TTenant, TCustomError>> {
        try {
          const tenantRef = doc(db, "tenants", tenant.id);
          await setDoc(tenantRef, tenant, { merge: true });
          return { data: tenant };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [tenantsApiTagTypes.Tenants],
    }),

    // updateTenantById ...
    // defines a function to update a tenant
    updateTenantById: builder.mutation<TTenant, TUpdateTenantByIdArgs>({
      async queryFn({
        id,
        newData,
      }): Promise<QueryReturnValue<TTenant, TCustomError>> {
        try {
          const tenantRef = doc(db, "tenants", id);
          await setDoc(tenantRef, newData, { merge: true });
          return {
            data: {
              id,
              ...newData,
            } as TTenant,
          };
        } catch (error: any) {
          return {
            error: {
              code: error.code,
              message: error.message,
            },
          };
        }
      },
      invalidatesTags: [tenantsApiTagTypes.Tenants],
    }),

    // updateTenantByEmail ...
    // defines a function to update a tenant
    updateTenantByEmail: builder.mutation<TTenant, TUpdateTenantByEmailArgs>({
      async queryFn({
        email,
        newData,
      }): Promise<QueryReturnValue<TTenant, TCustomError>> {
        try {
          const tenantsQuery = query(
            collection(db, "tenants"),
            where("email", "==", email),
          );
          const querySnapshot = await getDocs(tenantsQuery);

          if (querySnapshot.empty) {
            return {
              error: {
                code: 404,
                message: `Tenant with email ${email} not found`,
              },
            };
          }

          const tenantDoc = querySnapshot.docs[0];
          const tenantRef = doc(db, "tenants", tenantDoc.id);

          await setDoc(tenantRef, newData, { merge: true });
          return null;
        } catch (error: any) {
          return {
            error: {
              code: error.code || 500,
              message: error.message || "Failed to update tenant",
            },
          };
        }
      },
      invalidatesTags: [tenantsApiTagTypes.Tenants],
    }),

    // associateTenant ...
    // defines a function that associates tenants to property
    associateTenant: builder.mutation<void, TAssociateTenantArgs>({
      async queryFn({
        draftData,
        property,
      }): Promise<QueryReturnValue<void, TCustomError>> {
        try {
          const tenantRef = doc(db, "tenants", draftData.id);
          await setDoc(tenantRef, draftData, { merge: true });

          const propertyRef = doc(db, "properties", property.id);
          await setDoc(
            propertyRef,
            {
              ...property,
              rentees: [...(property.rentees || []), draftData.email],
              updatedBy: draftData.updatedBy,
              updatedOn: draftData.updatedOn,
            },
            { merge: true },
          );

          // set invite once the association is requested
          const inviteRef = doc(db, "invites", draftData.email.toLowerCase());
          await setDoc(inviteRef, {
            role: Role.Tenant,
            propertyId: property.id,
            email: draftData.email.toLowerCase(),
            createdBy: draftData.createdBy,
            createdOn: draftData.createdOn,
            updatedBy: draftData.updatedBy,
            updatedOn: draftData.updatedOn,
          });

          return { data: null };
        } catch (error) {
          /* eslint-disable no-console */
          console.error("Unable to process request. Error: ", error);
          return {
            error: {
              code: error.code,
              message: error.message,
            },
          };
        }
      },
      invalidatesTags: [
        tenantsApiTagTypes.Tenants,
        tenantsApiTagTypes.Properties,
      ],
    }),

    // fetch tenants where propertyId matches the passed in propertyId from tenants db
    // only retrieves active tenants
    getTenantByPropertyId: builder.query<TTenant[], string>({
      async queryFn(
        propertyId,
      ): Promise<QueryReturnValue<TTenant[], TCustomError>> {
        try {
          const q = query(
            collection(db, "tenants"),
            where("propertyId", "==", propertyId),
            where("isActive", "==", true),
          );

          const tenants: TTenant[] = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const tenant = { id: doc.id, ...doc.data() } as TTenant;
            tenants.push(tenant);
          });

          return { data: tenants };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [tenantsApiTagTypes.Tenants],
    }),
  }),
});

export const {
  useGetTenantListQuery,
  useLazyGetTenantListQuery,
  useGetTenantByPropertyIdQuery,
  useGetActiveTenantsByEmailAddressQuery,
  useCreateTenantMutation,
  useUpdateTenantByIdMutation,
  useUpdateTenantByEmailMutation,
  useAssociateTenantMutation,
} = tenantsApi;
