// useCalculateFinancialHealth ...
// defines a function that is used to calculate the financial health of your property.
export const useCalculateFinancialHealth = (properties) => {
  const totalMonthlyRentalIncome = properties?.reduce((acc, el) => {
    acc += Number(el?.rent || 0);
    acc += Number(el?.additionalRent || 0);
    return acc;
  }, 0);

  const securityDepositsCollected = properties?.reduce((acc, el) => {
    acc += Number(el?.securityDeposit || 0);
    return acc;
  }, 0);

  const totalSqFt = properties?.reduce((acc, el) => {
    acc += Number(el?.sqFt || 0);
    return acc;
  }, 0);

  const averageRentPerSqFt =
    totalSqFt > 0 ? totalMonthlyRentalIncome / totalSqFt : 0;

  return {
    totalMonthlyRentalIncome,
    averageRentPerSqFt,
    securityDepositsCollected,
  };
};
