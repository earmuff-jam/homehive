import dayjs from "dayjs";

import {
  CompleteRentStatusEnumValue,
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
} from "features/Rent/utils";

// useSelectedPropertyDetails ...
// defines a function that returns details about a specific property
// does not take gracePeriod into consideration to reduce confusion
export const useSelectedPropertyDetails = (
  property,
  tenants,
  currentMonthRent,
) => {
  const today = dayjs();

  const isAnyPropertySoR = tenants?.some((tenant) => tenant.isSoR);
  const primaryTenant = tenants?.find((tenant) => tenant?.isPrimary);

  const monthsSinceStart = today.diff(primaryTenant?.startDate, "month");
  const nextDueDate = dayjs(primaryTenant?.startDate).add(
    monthsSinceStart + 1,
    "month",
  );

  let totalRent =
    Number(property?.rent || 0) + Number(property?.additionalRent || 0);

  if (isAnyPropertySoR) {
    totalRent = tenants.reduce(
      (total, tenant) =>
        total + parseInt(tenant.rent || 0) + parseInt(property?.additionalRent),
      0,
    );
  }

  let nextRentalPaymentDueDate = nextDueDate;

  // tenant start date is due date if tenants are created for a
  // future date
  const primaryTenantStartDate = dayjs(primaryTenant?.startDate);
  if (primaryTenantStartDate.isAfter(today)) {
    return {
      nextPaymentDueDate: dayjs(primaryTenantStartDate).format("MMM DD"),
      totalRent: totalRent,
      isSelectedPropertySoR: false,
    };
  }

  if (currentMonthRent) {
    const isCurrentMonthPaid =
      currentMonthRent?.rentMonth === today.format("MMMM") &&
      [
        ManualRentStatusEnumValue,
        CompleteRentStatusEnumValue,
        PaidRentStatusEnumValue,
      ].includes(currentMonthRent?.status);

    if (!isCurrentMonthPaid) {
      // if current month is not paid, show the next month after last payment was made
      const rentPaidMonth = currentMonthRent?.rentMonth;
      nextRentalPaymentDueDate = dayjs(
        `${rentPaidMonth} ${today.year()}`,
        "MMMM YYYY",
      )
        .startOf("month")
        .add(1, "month");
    }
  }

  return {
    nextPaymentDueDate: dayjs(nextRentalPaymentDueDate).format("MMM DD"),
    totalRent: totalRent,
    isSelectedPropertySoR: false,
  };
};
