import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
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
    // fetch a list of all the existing tenants with active == true flag
    getTenantList: builder.query({
      async queryFn() {
        try {
          const q = query(
            collection(db, "tenants"),
            where("isActive", "==", true),
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
    // fetch tenants where tenantId matches the passed in tenantId from tenants db
    getTenantById: builder.query({
      async queryFn(tenantId) {
        try {
          const docRef = doc(db, "tenants", tenantId);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            return { error: { message: "Tenant not found" } };
          }
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
      providesTags: ["tenants"],
    }),
    // fetch tenants where email matches the passed in email from tenants db
    getTenantByEmailId: builder.query({
      async queryFn(email) {
        try {
          const tenantsRef = collection(db, "tenants");
          const q = query(tenantsRef, where("email", "==", email));

          const querySnapshot = await getDocs(q);
          const tenants = [];
          querySnapshot.forEach((doc) => {
            tenants.push({ id: doc.id, ...doc.data() });
          });

          const tenant = tenants.find((tenant) => tenant.email === email);
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
  useLazyGetTenantListQuery,
  useGetTenantByIdQuery,
  useGetTenantsByUserIdQuery,
  useGetTenantByEmailIdQuery,
  useGetTenantByPropertyIdQuery,
  useCreateTenantMutation,
  useUpdateTenantByIdMutation,
  useDeleteTenantByIdMutation,
} = tenantsApi;
