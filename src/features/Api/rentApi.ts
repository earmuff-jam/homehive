import {
  QueryReturnValue,
  createApi,
  fakeBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { TProperty, TRentRecordPayload } from "features/Rent/Rent.types";
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

// TRentTag ...
type TRentTag = "rent";

// TTagTypes ...
type TTagTypes = {
  Rent: TRentTag;
};

const rentApiTagTypes: TTagTypes = {
  Rent: "rent",
};

// TGetRentsByPropertyIdProps ...
type TGetRentsByPropertyIdProps = {
  propertyId: string;
  currentUserEmail: string;
};

// TGetRentByPropertyIdWithFiltersProps ...
type TGetRentByPropertyIdWithFiltersProps = {
  propertyId: string;
  tenantEmails: string[];
  rentMonth: string;
};

// TGetRentByMonthProps ...
type TGetRentByMonthProps = {
  propertyId: string;
  rentMonth: string;
};

export const rentApi = createApi({
  reducerPath: "rentApi",
  baseQuery: fakeBaseQuery<TCustomError>(),
  tagTypes: [rentApiTagTypes.Rent],
  endpoints: (builder) => ({
    // getRentsByPropertyId ...
    getRentsByPropertyId: builder.query<
      TRentRecordPayload[],
      TGetRentsByPropertyIdProps
    >({
      async queryFn({
        propertyId,
        currentUserEmail,
      }: TGetRentsByPropertyIdProps): Promise<
        QueryReturnValue<TRentRecordPayload[], TCustomError>
      > {
        try {
          const propertyDoc = await getDoc(doc(db, "properties", propertyId));

          if (!propertyDoc.exists()) {
            return {
              error: {
                code: 400,
                message: "Property not found",
              },
            };
          }

          const propertyData = propertyDoc.data() as TProperty;
          const isOwner = propertyData.ownerEmail === currentUserEmail;
          const isRentee = propertyData.rentees.some(
            (email) => email === currentUserEmail,
          );

          if (!isOwner && !isRentee) {
            /* eslint-disable no-console */
            console.error("unable to retrieve rental details. Invalid user.");
            return {
              error: {
                message: "Internal server error.",
                code: 500,
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

          const rents: TRentRecordPayload[] = [];
          querySnapshot.forEach((doc) => {
            // ensure id is pulled from the response
            rents.push({
              id: doc.id,
              ...(doc.data() as Omit<TRentRecordPayload, "id">),
            });
          });

          return { data: rents as TRentRecordPayload[] };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [rentApiTagTypes.Rent],
    }),

    // getRentsByPropertyIdWithFilters ...
    // Get rent records by property ID, tenant list, and current rent month.
    // all filters are required by default
    getRentsByPropertyIdWithFilters: builder.query<
      TRentRecordPayload[],
      TGetRentByPropertyIdWithFiltersProps
    >({
      async queryFn({
        propertyId,
        tenantEmails,
        rentMonth,
      }: TGetRentByPropertyIdWithFiltersProps): Promise<
        QueryReturnValue<TRentRecordPayload[], TCustomError>
      > {
        try {
          const q = query(
            collection(db, "rents"),
            where("propertyId", "==", propertyId),
          );

          const querySnapshot = await getDocs(q);

          const rents: TRentRecordPayload[] = [];
          const targetMonth = rentMonth.toLowerCase();

          const tenantEmailSet = new Set<string>(
            tenantEmails.map((email) => email.toLowerCase()),
          );

          querySnapshot.forEach((doc) => {
            const rent = { id: doc.id, ...doc.data() } as TRentRecordPayload;

            const monthMatch = rent.rentMonth?.toLowerCase?.() === targetMonth;
            const isEmailMatch = tenantEmailSet.has(
              rent.tenantEmail?.toLowerCase() ?? "",
            );
            if (isEmailMatch && monthMatch) {
              rents.push(rent);
            }
          });

          return { data: rents as TRentRecordPayload[] };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [rentApiTagTypes.Rent],
    }),

    // getRentByMonth ...
    getRentByMonth: builder.query<TRentRecordPayload[], TGetRentByMonthProps>({
      async queryFn({
        propertyId,
        rentMonth,
      }: TGetRentByMonthProps): Promise<
        QueryReturnValue<TRentRecordPayload[], TCustomError>
      > {
        try {
          const q = query(
            collection(db, "rents"),
            where("propertyId", "==", propertyId),
            where("rentMonth", "==", rentMonth),
          );

          const querySnapshot = await getDocs(q);
          const rents: TRentRecordPayload[] = [];

          querySnapshot.forEach((doc) => {
            const rent = { id: doc.id, ...doc.data() } as TRentRecordPayload;
            rents.push(rent);
          });

          return { data: rents as TRentRecordPayload[] };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [rentApiTagTypes.Rent],
    }),

    // createRentRecord ...
    createRentRecord: builder.mutation<TRentRecordPayload, TRentRecordPayload>({
      async queryFn(
        rentData,
      ): Promise<QueryReturnValue<TRentRecordPayload, TCustomError>> {
        try {
          const { id, tenantId, propertyId, rentMonth, ...rest } = rentData;

          if (!id || !tenantId || !propertyId || !rentMonth) {
            return {
              error: {
                code: 400,
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
                  code: 404,
                  message:
                    "Duplicate entry found. Rent data already exists for current user for selected property for current month.",
                },
              };
            }
          }

          const docRef = doc(db, "rents", id);

          const rentRecord: TRentRecordPayload = {
            id,
            tenantId,
            propertyId,
            rentMonth,
            ...rest,
          };

          await setDoc(docRef, rentRecord, { merge: true });
          return { data: rentRecord };
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
