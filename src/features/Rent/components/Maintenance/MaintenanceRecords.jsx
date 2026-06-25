import React from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import RowHeader from "common/RowHeader";
import ViewMaintenanceRecord from "features/Rent/components/Maintenance/ViewMaintenanceRecord";

export default function MaintenanceRecords({
  isPropertyOwner = false,
  isMaintenanceRecordsLoading,
  maintenanceRecords,
  propertyName,
  primaryTenantEmail,
  dataTour,
}) {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Maintenance Overview"
          caption={`View maintenance requests for ${propertyName}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        <Stack spacing={2}>
          {isMaintenanceRecordsLoading ? (
            <Skeleton height="5rem" />
          ) : (
            <ViewMaintenanceRecord
              isPropertyOwner={isPropertyOwner}
              data={maintenanceRecords}
              propertyName={propertyName}
              primaryTenantEmail={primaryTenantEmail}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
