import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { authenticatorFirestore as db } from "src/config";

// MaintenanceApiTagTypes ...
// used to define the tag types for maintenance api
const MaintenanceApiTagTypes = {
  getMaintenanceRecords: "rent/getMaintenanceRecords",
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
    // creates maintenance record
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
  }),
});

export const {
  useGetMaintenanceRecordsQuery,
  useCreateMaintenanceRecordMutation,
} = maintenanceApi;
