import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Role } from "features/Auth/AuthHelper";
import {
  collection,
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
    // getTenantsByPropertiesArr ...
    // defines a query fn to return tenants list for each property passed in query; supports active flag
    getTenantsByPropertiesArr: builder.query({
      async queryFn({ propertyIds = [], isActive = true }) {
        try {
          // limits filter to 10 for firestore
          if (propertyIds.length > 10) {
            console.debug("Unable to process properties > 10");
          }
          const propertyIdsToUse = propertyIds?.slice(0, 10);

          const uniqueTenants = [];
          const foundEmailAddress = new Set();

          const q = query(
            collection(db, "tenants"),
            where("isActive", "==", isActive),
            where("propertyId", "in", propertyIdsToUse),
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
    // associate tenant workflow
    // populates tenants, updates property && updates tenant role
    associateTenant: builder.mutation({
      async queryFn({ draftData, property }) {
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
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["tenants", "properties"],
    }),
    // removeTenantAssociation
    // removes selected tenant, updates property
    removeTenantAssociation: builder.mutation({
      async queryFn({ tenantId, propertyId, rentees, updatedBy, updatedOn }) {
        try {
          const tenantRef = doc(db, "tenants", tenantId);
          await setDoc(
            tenantRef,
            { isActive: false, updatedBy, updatedOn },
            { merge: true },
          );

          const propertyRef = doc(db, "properties", propertyId);
          await setDoc(
            propertyRef,
            {
              rentees,
              updatedBy,
              updatedOn,
            },
            { merge: true },
          );

          return { data: null };
        } catch (error) {
          /* eslint-disable no-console */
          console.error("Unable to process request. Error: ", error);
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["tenants", "properties"],
    }),
  }),
});

export const {
  useGetTenantListQuery,
  useLazyGetTenantListQuery,
  useGetTenantsByUserIdQuery,
  useLazyGetTenantsByPropertiesArrQuery,
  useGetActiveTenantsByEmailAddressQuery,
  useGetTenantByPropertyIdQuery,
  useCreateTenantMutation,
  useUpdateTenantByIdMutation,
  useAssociateTenantMutation,
  useRemoveTenantAssociationMutation,
} = tenantsApi;
