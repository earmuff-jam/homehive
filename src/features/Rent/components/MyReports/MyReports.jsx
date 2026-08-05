import React, { useEffect, useState } from "react";

import { Skeleton, Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useGetPropertiesByUserIdQuery } from "features/Api/propertiesApi";
import { useLazyGetRentsByPropertiesQuery } from "features/Api/rentApi";
import { useLazyGetTenantsByPropertiesArrQuery } from "features/Api/tenantsApi";
import IncomeProjectionWidget from "features/Rent/components/MyReports/IncomeProjectionWidget";
import ReportOverview from "features/Rent/components/MyReports/ReportOverview";
import StatisticsWidget from "features/Rent/components/MyReports/StatisticsWidget";
import { useAppTitle } from "hooks/useAppTitle";

const MyReports = () => {
  useAppTitle("Analytics and Reporting");

  const user = fetchLoggedInUser();

  const {
    data: properties = [],
    isLoading: isPropertiesListLoading,
    isSuccess: isPropertiesListSuccess,
  } = useGetPropertiesByUserIdQuery(user.uid, {
    skip: !user?.uid,
  });

  const [
    getExistingTenants,
    { data: existingTenants, isLoading: isGetExistingTenantsLoading },
  ] = useLazyGetTenantsByPropertiesArrQuery();

  const [
    getExistingRents,
    { data: existingRents, isLoading: isGetExistingRentsLoading },
  ] = useLazyGetRentsByPropertiesQuery();

  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (!isPropertiesListLoading && isPropertiesListSuccess) {
      const propertiesIds = properties?.map((property) => property.id);
      getExistingTenants({ propertyIds: propertiesIds, isActive: true });
      getExistingRents({ propertyIds: propertiesIds, isActive: true });
    }
  }, [isPropertiesListLoading]);

  if (
    isPropertiesListLoading ||
    isGetExistingTenantsLoading ||
    isGetExistingRentsLoading
  ) {
    return <Skeleton height="10rem" />;
  }

  if (properties?.length <= 0) {
    return <EmptyComponent caption="Add properties to view reports" />;
  }

  return (
    <Stack spacing={1}>
      <RowHeader
        title="Reports"
        caption="View analytics and reports about your properties."
        sxProps={{
          fontWeight: "bold",
          color: "text.secondary",
          textAlign: "left",
        }}
      />

      <ReportOverview properties={properties} />

      <StatisticsWidget
        data={properties}
        existingTenants={existingTenants}
        existingRents={existingRents}
      />

      <IncomeProjectionWidget
        properties={properties}
        existingRents={existingRents}
      />

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default MyReports;
