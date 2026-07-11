import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import { Paper, Skeleton, Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useGetPropertiesByUserIdQuery } from "features/Api/propertiesApi";
import { useLazyGetRentsByPropertiesQuery } from "features/Api/rentApi";
import { useLazyGetTenantsByPropertiesArrQuery } from "features/Api/tenantsApi";
import PieChart from "features/Rent/components/Reporting/ PieChart";
import FinancialHealth from "features/Rent/components/Reporting/FinancialHealthAccordion";
import PortfolioHealth from "features/Rent/components/Reporting/PortfolioHealth";
import SeriesChart from "features/Rent/components/Reporting/SeriesChart";
import Statistics from "features/Rent/components/Reporting/Statistics";
import {
  CompleteRentStatusEnumValue,
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
} from "features/Rent/utils";
import { useAppTitle } from "hooks/useAppTitle";

const Reporting = () => {
  useAppTitle("Analytics and Reporting");

  const user = fetchLoggedInUser();

  const {
    data: properties = [],
    isLoading: isPropertiesListLoading,
    isSuccess: isPropertiesListSuccess,
  } = useGetPropertiesByUserIdQuery(user.uid, {
    skip: !user?.uid,
  });

  const [getExistingTenants, getExistingTenantsResult] =
    useLazyGetTenantsByPropertiesArrQuery();

  const [getExistingRents, getExistingRentsResult] =
    useLazyGetRentsByPropertiesQuery();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const avgProjectedIncrease = properties?.reduce(
    (acc, el) => (acc += Number(el?.rentIncrement)),
    0,
  );

  const portfolioHealth = calculatePropertyHealth(properties);
  const financialHealth = calculateFinancialHealth(properties);
  const projectedRentalChange = calculateProjectedRentalChange(
    getExistingRentsResult?.data || [],
    avgProjectedIncrease,
    3,
  );
  const totalCollectedRentsByProperties = calculateTotalCollectedRents(
    properties,
    getExistingRentsResult?.data || [],
  );

  useEffect(() => {
    if (!isPropertiesListLoading && isPropertiesListSuccess) {
      const propertiesIds = properties?.map((property) => property.id);
      getExistingTenants({ propertyIds: propertiesIds, isActive: true });
      getExistingRents({ propertyIds: propertiesIds, isActive: true });
    }
  }, [isPropertiesListLoading]);

  if (
    isPropertiesListLoading ||
    getExistingTenantsResult.isLoading ||
    getExistingRentsResult.isLoading
  ) {
    return <Skeleton height="10rem" />;
  }

  if (properties?.length <= 0) {
    return <EmptyComponent caption="Add properties to view reports" />;
  }

  return (
    <Stack spacing={1}>
      <RowHeader
        title="Analytics and Reporting"
        caption="View analytics about your registered properties"
        sxProps={{
          fontWeight: "bold",
          color: "text.secondary",
          textAlign: "left",
        }}
      />

      <Paper variant="outlined" sx={{ padding: 2 }} data-tour="report-stats-0">
        <Stack spacing={1}>
          <PortfolioHealth portfolioHealth={portfolioHealth} />
          <FinancialHealth
            financialHealth={financialHealth}
            projectedRentalChange={projectedRentalChange}
            totalCollectedRentsByProperties={totalCollectedRentsByProperties}
          />
        </Stack>
      </Paper>

      {/* Property statistics */}
      <Paper variant="outlined" sx={{ padding: 2 }} data-tour="report-stats-3">
        <RowHeader
          title="Property statistics"
          caption="View statistics about your registered properties"
          sxProps={{
            fontWeight: "bold",
            color: "text.secondary",
            textAlign: "left",
          }}
        />
        <Statistics
          properties={properties}
          existingTenants={getExistingTenantsResult?.data || []}
          existingRents={getExistingRentsResult?.data || []}
        />
      </Paper>

      {/* Income projection */}
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <RowHeader
          title="Rental Income Projection"
          caption="View rental income projection and collected rents"
          sxProps={{
            fontWeight: "bold",
            color: "text.secondary",
            textAlign: "left",
          }}
        />
        <Stack
          spacing={1}
          marginTop={2}
          justifyContent="space-between"
          direction={{ md: "row", xs: "column" }}
          width="auto"
          height="auto"
          alignSelf="inherit"
        >
          <SeriesChart
            dataTour="report-stats-1"
            label="Average Rental Income Projection"
            data={projectedRentalChange}
          />
          <PieChart
            dataTour="report-stats-2"
            label="Total Collected Rents"
            data={totalCollectedRentsByProperties}
          />
        </Stack>
      </Paper>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

// calculatePropertyHealth ...
// defines a function that is used to calculate the health of your property
const calculatePropertyHealth = (properties = []) => {
  const totalProperties = properties?.length;
  const vacantProperties = properties?.filter(
    (property) => property.rentee?.length === 0,
  )?.length;

  return {
    totalProperties: totalProperties,
    vacantProperties: vacantProperties,
  };
};

// calculateFinancialHealth ...
// defines a function that is used to calculate the financial health of your property.
const calculateFinancialHealth = (properties) => {
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

// calculateProjectedRentalChange ...
// defines a function that calculates projected rental change
const calculateProjectedRentalChange = (
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

// calculateTotalCollectedRents ...
// defines a function that calculates the projected yearly rent
const calculateTotalCollectedRents = (properties, rents) => {
  if (!properties?.length || !rents?.length) {
    return [[], [], []];
  }

  const validRents = rents.filter((r) =>
    [
      ManualRentStatusEnumValue,
      CompleteRentStatusEnumValue,
      PaidRentStatusEnumValue,
    ].includes(r.status),
  );

  const map = {};

  validRents.forEach((r) => {
    const propertyId = r.propertyId;
    const amount = Number(r.rentAmount || 0);

    if (!propertyId) return;

    map[propertyId] = (map[propertyId] || 0) + amount;
  });

  const labels = [];
  const values = [];
  const backgroundColors = [];

  const palette = [
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(255, 159, 64, 0.7)",
  ];

  properties.forEach((p, i) => {
    const value = map[p.id] || 0;

    labels.push(p.name);
    values.push(value);
    backgroundColors.push(palette[i % palette.length]);
  });

  return [labels, values, backgroundColors];
};

export default Reporting;
