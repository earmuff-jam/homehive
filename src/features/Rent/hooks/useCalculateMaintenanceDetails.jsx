import { useMemo } from "react";

import dayjs from "dayjs";

import { MaintenanceRecordEnumValues } from "features/Rent/constants";

// useCalculateMaintenanceDetails ...
// defines a function that is used to calculate maintenance details
export const useCalculateMaintenanceDetails = (data = [], isFetching) => {
  const isRecentRecord = useMemo(() => {
    return data?.some(
      (record) =>
        dayjs().diff(dayjs(record.createdOn), "day") <= 7 &&
        record.status !== MaintenanceRecordEnumValues.Completed,
    );
  }, [isFetching]);

  return {
    isRecentRecord: isRecentRecord,
  };
};
