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

export const rentApi = createApi({
  reducerPath: "rentApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["rent"],
  endpoints: (builder) => ({
    // fetches rents by property id and currentUserEmail
    // currentUserEmail must either be a tenant or a property owner to view data
    // if currentUserEmail is tenant, only returns that data.
    // if currentUserEmail is propertyOwner, returns all data for all rental period for that property.
    getRentsByPropertyId: builder.query({
      async queryFn({ propertyId, currentUserEmail }) {
        try {
          const propertyDoc = await getDoc(doc(db, "properties", propertyId));

          if (!propertyDoc.exists()) {
            return {
              error: {
                message: "Property not found",
                code: "not-found",
              },
            };
          }

          const propertyData = propertyDoc.data();

          const isOwner = propertyData.ownerEmail === currentUserEmail;
          const isRentee = (propertyData.rentees || []).some(
            (email) => email === currentUserEmail,
          );

          if (!isOwner && !isRentee) {
            /* eslint-disable no-console */
            console.error(
              "unable to retrieve rental details. invalid params detected",
            );
            return {
              error: {
                message:
                  "Access denied: Not a property owner or current tenant.",
                code: "500",
              },
            };
          }

          // retrieve all rental info if viewing by propertyOwner
          // retrieve specific rental info if viewing by tenant
          let draftQuery;
          draftQuery = query(
            collection(db, "rents"),
            where("propertyId", "==", propertyId),
          );

          if (isRentee) {
            draftQuery = query(
              collection(db, "rents"),
              where("propertyId", "==", propertyId),
              where("tenantEmail", "==", currentUserEmail),
            );
          }

          const querySnapshot = await getDocs(draftQuery);

          const rents = [];
          querySnapshot.forEach((doc) => {
            rents.push({ id: doc.id, ...doc.data() });
          });

          return { data: rents };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["rent"],
    }),
    // Get rent records by property ID, tenant list, and current rent month.
    // all filters are required by default
    getRentsByPropertyIdWithFilters: builder.query({
      async queryFn({ propertyId, tenantEmails = [], rentMonth }) {
        try {
          const q = query(
            collection(db, "rents"),
            where("propertyId", "==", propertyId),
          );

          const querySnapshot = await getDocs(q);
          const rents = [];

          const tenantEmailSet = new Set(
            tenantEmails.map((email) => email.toLowerCase()),
          );
          const targetMonth = rentMonth.toLowerCase();

          querySnapshot.forEach((doc) => {
            const rent = { id: doc.id, ...doc.data() };

            const emailMatch = tenantEmailSet.has(
              rent.tenantEmail?.toLowerCase() ?? "",
            );
            const monthMatch = rent.rentMonth?.toLowerCase?.() === targetMonth;

            if (emailMatch && monthMatch) {
              rents.push(rent);
            }
          });

          return { data: rents };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["rent"],
    }),
    // get rental information by property id for a specific month
    getRentByMonth: builder.query({
      async queryFn({ propertyId, rentMonth }) {
        try {
          const q = query(
            collection(db, "rents"),
            where("propertyId", "==", propertyId),
            where("rentMonth", "==", rentMonth),
          );

          const querySnapshot = await getDocs(q);
          const rents = [];
          querySnapshot.forEach((doc) => {
            rents.push({ id: doc.id, ...doc.data() });
          });

          return { data: rents };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: ["rent"],
    }),
    // creates rental record for a property
    // occurs when user initiates stripe checkout session
    createRentRecord: builder.mutation({
      async queryFn(rentData) {
        try {
          const { id, tenantId, propertyId, rentMonth, ...rest } = rentData;

          if (!id || !tenantId || !propertyId || !rentMonth) {
            return {
              error: {
                message: "Missing required fields.",
              },
            };
          }

          // Check for duplicate rent record
          const rentQuery = query(
            collection(db, "rents"),
            where("tenantId", "==", tenantId),
            where("propertyId", "==", propertyId),
            where("rentMonth", "==", rentMonth),
          );

          const existing = await getDocs(rentQuery);
          if (!existing.empty) {
            // check if any rent already has status "complete"
            const isComplete = existing.docs.some(
              (doc) => doc.get("status") === "complete",
            );

            if (isComplete) {
              return {
                error: {
                  message:
                    "Duplicate entry found. Rent data already exists for current user for selected property for current month.",
                },
              };
            }
          }

          const docRef = doc(db, "rents", id);
          await setDoc(
            docRef,
            { tenantId, propertyId, rentMonth, ...rest },
            { merge: true },
          );

          return { data: { tenantId, propertyId, rentMonth, ...rest } };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: ["rent"],
    }),
  }),
});

export const {
  useGetRentsByPropertyIdQuery,
  useLazyGetRentsByPropertyIdWithFiltersQuery,
  useLazyGetRentByMonthQuery,
  useCreateRentRecordMutation,
} = rentApi;
