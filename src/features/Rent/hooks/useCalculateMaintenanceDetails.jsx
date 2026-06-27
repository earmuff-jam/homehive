import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";
import { MaintenanceRecordEnumValues } from "features/Rent/constants";

dayjs.extend(duration);

const formatTimeDuration = (timeInMs = 0) => {
  if (timeInMs === 0) return 0;
  let day = dayjs.duration(timeInMs);

  const years = Math.floor(day.asYears());
  day = day.subtract(years, "year");

  const days = Math.floor(day.asDays());
  day = day.subtract(days, "day");

  const hours = day.hours();
  const minutes = day.minutes();

  return [
    years && `${years}y`,
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
  ]
    .filter(Boolean)
    .join(" ");
};

// useCalculateMaintenanceDetails ...
// defines a function that is used to calculate maintenance details
export const useCalculateMaintenanceDetails = (
  data = [],
  totalRentalIncomeForYr = 0,
) => {
  const openMaintenanceRecords = data?.filter(
    (record) => record.status !== MaintenanceRecordEnumValues.Completed,
  );

  const isRecentRecord = data?.some(
    (record) =>
      dayjs().diff(dayjs(record.createdOn), "day") <= 7 &&
      record.status !== MaintenanceRecordEnumValues.Completed,
  );

  const oldestMaintenanceRecord =
    data?.length > 0
      ? data.reduce((oldest, current) =>
          dayjs(current?.updatedOn).isBefore(oldest?.updatedOn)
            ? current
            : oldest,
        )
      : null;

  const totalSpentCurrentYear = data?.reduce((acc, el) => {
    const issueCreatedThisYr = dayjs(el?.createdOn).isSame(dayjs(), "year");
    if (
      el?.status === MaintenanceRecordEnumValues.Completed &&
      issueCreatedThisYr
    ) {
      acc += Number(el?.cost) || 0;
    }

    return acc;
  }, 0);

  const totalSpentPreviousYear = data?.reduce((acc, el) => {
    const issueCreatedPastYr = dayjs(el?.createdOn).isSame(
      dayjs().subtract(1, "year"),
      "year",
    );
    if (
      el?.status === MaintenanceRecordEnumValues.Completed &&
      issueCreatedPastYr
    ) {
      acc += Number(el?.cost) || 0;
    }

    return acc;
  }, 0);

  const combinedResolutionTime = data?.reduce((acc, el) => {
    if (el?.status === MaintenanceRecordEnumValues.Completed) {
      const totalTimeTaken = dayjs(el?.updatedOn).diff(el?.createdOn);
      acc += totalTimeTaken;
    }

    return acc;
  }, 0);
  const averageResolutionTime = combinedResolutionTime / data?.length || 0;

  const costRentRatio = totalSpentCurrentYear / totalRentalIncomeForYr;

  return {
    isRecentRecord: isRecentRecord,
    openMaintenanceRecords: openMaintenanceRecords,
    totalSpentCurrentYear: totalSpentCurrentYear || 0,
    totalSpentPreviousYear: totalSpentPreviousYear || 0,
    costRentRatio: costRentRatio || 0,
    averageResolutionTime: formatTimeDuration(averageResolutionTime),
    latestUpdatedOn: oldestMaintenanceRecord?.latestUpdatedOn,
  };
};
