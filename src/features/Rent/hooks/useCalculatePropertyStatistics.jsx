import dayjs from "dayjs";

import {
  CompleteRentStatusEnumValue,
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
} from "features/Rent/utils";

const currentDateTime = dayjs().toISOString();

// calculateRentInfo ...
// calculates the average of on time rental payments upto 12 months and
// also calculates the average days the primary tenant is late on payment upto 12 months
const calculateRentInfo = (
  totalMonthsRenting,
  rentsForSelectedProperty,
  primaryTenant,
) => {
  const totalTimeline = totalMonthsRenting > 12 ? 12 : totalMonthsRenting;
  const totalMonthsRentingInArr = Array.from(
    { length: totalTimeline },
    (_, idx) => idx + 1,
  );

  const populateRentDetails = Array.from(totalMonthsRentingInArr)?.reduce(
    (acc, el) => {
      // every iteration we add 1 month depending on how long the tenant is residing
      const rentDueOn = dayjs(primaryTenant?.startDate)
        .add(el, "month")
        .add(primaryTenant?.gracePeriod, "day")
        .toISOString();

      const monthRentDueOn = dayjs(rentDueOn).format("MMMM");
      const selectedMonthRent = rentsForSelectedProperty?.find(
        (filteredRent) => {
          return filteredRent?.rentMonth === monthRentDueOn;
        },
      );

      const isRentForSelectedMonthPaid = [
        PaidRentStatusEnumValue,
        CompleteRentStatusEnumValue,
        ManualRentStatusEnumValue,
      ].includes(selectedMonthRent?.status);

      if (isRentForSelectedMonthPaid) {
        const isRentPaidWithinGraceDeadline = dayjs(
          selectedMonthRent?.createdOn,
        ).isBefore(rentDueOn);

        // if rent is paid and within deadline
        if (isRentPaidWithinGraceDeadline) {
          acc.totalOnTimePaymentsMade++;
        } else {
          // if rent is paid but not within deadline
          const isRentPaymentLate = dayjs(selectedMonthRent?.createdOn).isAfter(
            rentDueOn,
          );

          if (isRentPaymentLate) {
            // number of calendar days late
            const timeDifference = dayjs(selectedMonthRent.createdOn)
              .startOf("day")
              .diff(dayjs(rentDueOn).startOf("day"), "day");
            acc.totalLateDaysPaymentMade += timeDifference;
          }
        }
      } else {
        // if rent is not paid
        // does not take other forms of due into account
        acc.outstandingBalance += primaryTenant?.rent;
      }

      return acc;
    },
    {
      totalOnTimePaymentsMade: 0,
      totalLateDaysPaymentMade: 0,
      outstandingBalance: 0,
    },
  );

  return populateRentDetails;
};

// useCalculatePropertyStatistics ...
// defines a function that returns selected information against a property
// used in the statistics a/o of the selected property
export const useCalculatePropertyStatistics = (
  properties = [],
  selectedPropertyId,
  existingTenants = [],
  existingRents = [],
) => {
  const selectedProperty = properties?.find(
    (property) => property?.id === selectedPropertyId,
  );

  const filteredTenants = existingTenants?.filter(
    (existingTenant) => existingTenant?.propertyId === selectedPropertyId,
  );

  const filteredRentsForSelectedProperty = existingRents?.filter(
    (existing) => existing?.propertyId === selectedPropertyId,
  );

  // TODO - need to revamp SoR, work in another ticket
  const isAnyTenantSoR = existingTenants?.some((tenant) => tenant?.isSoR);
  const primaryTenant = isAnyTenantSoR
    ? filteredTenants[0]
    : filteredTenants[0];

  const unit = primaryTenant?.term?.endsWith("y") ? "year" : "month";
  const leaseExiprationDate = dayjs(primaryTenant?.startDate).add(
    parseInt(primaryTenant?.term),
    unit,
  );

  const formattedLeaseExpirationDate =
    leaseExiprationDate?.format("MM-DD-YYYY");

  const totalMonthsRenting = dayjs(currentDateTime).diff(
    dayjs(primaryTenant?.startDate),
    "month",
  );

  const draftRentInfo = calculateRentInfo(
    totalMonthsRenting,
    filteredRentsForSelectedProperty,
    primaryTenant,
  );

  const averageOnTimeRentPayment =
    existingRents?.length > 0
      ? draftRentInfo?.totalOnTimePaymentsMade /
        filteredRentsForSelectedProperty?.length
      : 0;

  const propertyVacantDaysCount =
    selectedProperty?.rentee?.length <= 0
      ? Math.max(
          dayjs(selectedProperty?.moveOutDate).diff(
            dayjs(primaryTenant?.startDate),
          ),
          0,
        )
      : 0;

  // calculates the total days the property is empty
  const totalEmptyDaysAcrossAllProperties = properties?.reduce((acc, el) => {
    const tenantForSelectedProperty = existingTenants?.find(
      (existing) => existing?.propertyId === el.id,
    );
    const totalDiffInDays = Math.max(
      dayjs(tenantForSelectedProperty?.startDate).diff(
        dayjs(el?.moveOutDate),
        "day",
      ),
      0,
    );
    return acc + totalDiffInDays;
  }, 0);

  const averageDaysToCompleteVacancy =
    properties?.length > 0
      ? totalEmptyDaysAcrossAllProperties / properties?.length
      : 0;

  return {
    primaryTenant: primaryTenant,
    isAnyTenantSoR: isAnyTenantSoR,
    selectedProperty: selectedProperty,
    outstandingBalance: draftRentInfo?.outstandingBalance,
    averageLateRentPayment: draftRentInfo?.totalLateDaysPaymentMade,
    averageOnTimeRentPayment: averageOnTimeRentPayment,
    leaseExiprationDate: formattedLeaseExpirationDate,
    propertyVacantDaysCount: propertyVacantDaysCount,
    averageDaysToCompleteVacancy: averageDaysToCompleteVacancy,
    averageEmptyDaysAcrossProperties: totalEmptyDaysAcrossAllProperties,
  };
};
