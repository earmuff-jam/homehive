import React from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import RowHeader from "common/RowHeader";
import ViewMaintenanceRecord from "features/Rent/components/Maintenance/ViewMaintenanceRecord";

const MaintenanceRecords = ({
  isPropertyOwner = false,
  isMaintenanceRecordsLoading,
  maintenanceRecords,
  property,
  primaryTenantEmail,
  dataTour,
}) => {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Maintenance Overview"
          caption={`View maintenance requests for ${property?.name}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        <Stack spacing={2}>
          {isMaintenanceRecordsLoading ? (
            <Skeleton height="5rem" />
          ) : (
            <ViewMaintenanceRecord
              isPropertyOwner={isPropertyOwner}
              data={maintenanceRecords}
              property={property}
              primaryTenantEmail={primaryTenantEmail}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MaintenanceRecords;
