import dayjs from "dayjs";

// useSelectedPropertyDetails ...
// defines a function that returns details about a specific property
// does not take gracePeriod into consideration to reduce confusion
export const useSelectedPropertyDetails = (property, tenants) => {
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

  return {
    nextPaymentDueDate: dayjs(nextDueDate).format("MMM DD"),
    totalRent: totalRent,
    isSelectedPropertySoR: false,
  };
};
