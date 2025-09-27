import React from "react";

import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import AButton from "common/AButton";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader/RowHeader";
import TenantBadge from "features/RentWorks/components/Widgets/TenantBadge";
import Tenants from "features/RentWorks/components/Widgets/Tenants";

export default function TenantsOverview({
  property,
  tenants = [],
  isTenantsLoading,
  toggleAssociateTenantsPopup,
  dataTour,
}) {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ margin: "0rem 0rem 1rem 0rem" }}
        >
          <RowHeader
            title="Tenants"
            caption={`Active tenants for ${property?.name}`}
            sxProps={{
              alignItems: "flex-start",
              color: "text.secondary",
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Associate tenants">
              <Box>
                <AButton
                  size="small"
                  variant="outlined"
                  onClick={() => toggleAssociateTenantsPopup()}
                  label="Associate tenants"
                />
              </Box>
            </Tooltip>
            <TenantBadge tenantsLength={tenants.length} />
          </Stack>
        </Stack>
        {isTenantsLoading ? (
          <Skeleton height="5rem" />
        ) : tenants.length === 0 ? (
          <EmptyComponent caption="Associate tenants to begin." />
        ) : (
          <Tenants tenants={tenants || []} property={property} />
        )}
      </CardContent>
    </Card>
  );
}
