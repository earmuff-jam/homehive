import dayjs from "dayjs";

import {
  CompleteRentStatusEnumValue,
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
} from "features/Rent/utils";

// useCalculateProjectedRentalChange ...
// defines a function that calculates projected rental change
export const useCalculateProjectedRentalChange = (
  rents = [],
  projectRentIncrease = 0,
  yearsAhead = 3,
) => {
  const sortedRentalPayments = rents
    ?.filter((rent) =>
      [
        ManualRentStatusEnumValue,
        CompleteRentStatusEnumValue,
        PaidRentStatusEnumValue,
      ].includes(rent.status),
    )
    .sort((a, b) => dayjs(a?.createdOn) - dayjs(b.createdOn));

  if (sortedRentalPayments?.length <= 0) {
    return { labels: [], historical: [], forecast: [] };
  }

  const yearlyMap = new Map();
  sortedRentalPayments.forEach((rent) => {
    const year = dayjs(rent?.createdOn).year();

    yearlyMap.set(
      year,
      (yearlyMap.get(year) || 0) + Number(rent.rentAmount || 0),
    );
  });

  const years = Array.from(yearlyMap.keys()).sort();
  const rentArr = years.map((y) => yearlyMap.get(y));

  const avgRateOfRentalPropertyChange =
    rentArr.length > 1
      ? (rentArr[rentArr.length - 1] - rentArr[0]) / (rentArr.length - 1)
      : 0;

  const forecast = [];
  let current = rentArr[rentArr.length - 1];

  for (let i = 0; i < yearsAhead; i++) {
    current =
      current +
      avgRateOfRentalPropertyChange * 0.5 + // add market smoothing
      projectRentIncrease;

    forecast.push(Number(current.toFixed(2)));
  }

  const lastYear = years[years.length - 1];

  const forecastYears = Array.from(
    { length: yearsAhead },
    (_, idx) => lastYear + idx + 1,
  );

  return {
    labels: [...years, ...forecastYears],
    historical: [...rentArr, ...Array(yearsAhead).fill(null)],
    forecast: [...Array(rentArr.length).fill(null), ...forecast],
  };
};
