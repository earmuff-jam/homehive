import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

export const tenantsApi = createApi({
  reducerPath: "tenantsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["tenants"],
  endpoints: (builder) => ({
    getTenantList: builder.query({
      // fetch isActive tenants by default
      // pass boolean value to retrieve inactive tenants
      async queryFn(isActive = true) {
        try {
          const uniqueTenants = [];
          const foundEmailAddress = new Set();

          const q = query(
            collection(db, "tenants"),
            where("isActive", "==", isActive),
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
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
      providesTags: ["tenants"],
    }),
    // fetch matching tenants by email who are also active
    getActiveTenantsByEmailAddress: builder.query({
      async queryFn(email) {
        try {
          const tenantsRef = collection(db, "tenants");
          const q = query(
            tenantsRef,
            where("email", "==", email),
            where("isActive", "==", true),
          );

          const tenants = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            tenants.push({ id: doc.id, ...doc.data() });
          });

          // only 1 tenant can remain active at any given
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
      providesTags: ["tenants"],
    }),
    // fetch tenants where createdBy matches the passed in userId from tenants db
    getTenantsByUserId: builder.query({
      async queryFn(userId) {
        try {
          const q = query(
            collection(db, "tenants"),
            where("createdBy", "==", userId),
          );
          const querySnapshot = await getDocs(q);
          const tenants = [];
          querySnapshot.forEach((doc) => {
            tenants.push({ id: doc.id, ...doc.data() });
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
      providesTags: ["tenants"],
    }),
    // fetch tenants where propertyId matches the passed in propertyId from tenants db
    // only retrieves active tenants
    getTenantByPropertyId: builder.query({
      async queryFn(propertyId) {
        try {
          const q = query(
            collection(db, "tenants"),
            where("propertyId", "==", propertyId),
          );
          const querySnapshot = await getDocs(q);
          const activeTenants = [];

          querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            if (data.isActive) {
              activeTenants.push(data);
            }
          });

          return { data: activeTenants };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["tenants"],
    }),
    // create tenant in tenants db
    createTenant: builder.mutation({
      async queryFn(tenant) {
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
      invalidatesTags: ["tenants"],
    }),
    // update tenant in tenants db
    updateTenantById: builder.mutation({
      async queryFn({ id, newData }) {
        try {
          const tenantRef = doc(db, "tenants", id);
          await setDoc(tenantRef, newData, { merge: true });
          return { data: newData };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["tenants"],
    }),
    // deletes tenants where tenantId matches the passed in tenantId from tenants db
    deleteTenantById: builder.mutation({
      async queryFn(id) {
        try {
          const tenantRef = doc(db, "tenants", id);
          await deleteDoc(tenantRef);
          return { data: { id } };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["tenants"],
    }),
  }),
});

export const {
  useGetTenantListQuery,
  useLazyGetTenantListQuery,
  useGetTenantsByUserIdQuery,
  useGetActiveTenantsByEmailAddressQuery,
  useGetTenantByPropertyIdQuery,
  useCreateTenantMutation,
  useUpdateTenantByIdMutation,
  useDeleteTenantByIdMutation,
} = tenantsApi;
