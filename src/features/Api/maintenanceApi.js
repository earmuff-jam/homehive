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

// MaintenanceApiTagTypes ...
// used to define the tag types for maintenance api
const MaintenanceApiTagTypes = {
  getMaintenanceRecord: "property/getMaintenanceRecord",
  getMaintenanceRecords: "property/getMaintenanceRecords",
};

export const maintenanceApi = createApi({
  reducerPath: "maintenanceApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(MaintenanceApiTagTypes),
  endpoints: (builder) => ({
    // getMaintenanceRecords ...
    // defines a function that returns all maintenance records for a selected property
    getMaintenanceRecords: builder.query({
      async queryFn({ propertyId }) {
        try {
          const q = query(
            collection(db, "maintenance"),
            where("propertyId", "==", propertyId),
          );
          const querySnapshot = await getDocs(q);

          let maintenanceRecords = [];
          querySnapshot.forEach((doc) => {
            maintenanceRecords.push({ id: doc.id, ...doc.data() });
          });

          return { data: maintenanceRecords };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [MaintenanceApiTagTypes.getMaintenanceRecords],
    }),
    // getMaintenanceRecord ...
    // defines a function that returns a maintenance record
    getMaintenanceRecord: builder.query({
      async queryFn({ maintenanceId }) {
        try {
          const documentRef = doc(db, "maintenance", maintenanceId);
          const documentSnapshot = await getDoc(documentRef);
          if (!documentSnapshot.exists())
            return { error: { message: "maintenance details not found" } };
          return { data: documentSnapshot.data() };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [MaintenanceApiTagTypes.getMaintenanceRecord],
    }),
    // createMaintenanceRecord ...
    // defines a function that creates a maintenance record
    createMaintenanceRecord: builder.mutation({
      async queryFn(maintenanceData) {
        try {
          const docRef = doc(db, "maintenance", maintenanceData?.id);
          await setDoc(docRef, maintenanceData, { merge: true });

          return { data: maintenanceData };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [MaintenanceApiTagTypes.getMaintenanceRecords],
    }),
    // updateMaintenanceData ...
    // update maintenance record
    updateMaintenanceData: builder.mutation({
      async queryFn(maintenanceData) {
        try {
          const docRef = doc(db, "maintenance", maintenanceData?.id);
          await setDoc(docRef, maintenanceData, { merge: true });

          return { data: maintenanceData };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [MaintenanceApiTagTypes.getMaintenanceRecords],
    }),
  }),
});

export const {
  useGetMaintenanceRecordsQuery,
  useGetMaintenanceRecordQuery,
  useLazyGetMaintenanceRecordsQuery,
  useCreateMaintenanceRecordMutation,
  useUpdateMaintenanceDataMutation,
} = maintenanceApi;
