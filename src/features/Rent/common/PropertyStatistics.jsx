import React from "react";

import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import {
  derieveTotalRent,
  formatCurrency,
  getOccupancyRate,
} from "features/Rent/utils";

export default function PropertyStatistics({
  isPropertyLoading,
  property,
  isAnyTenantSoR,
  tenants,
  dataTour,
}) {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }} data-tour={dataTour}>
      <Grid item xs={12} sm={6} md={3}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {property?.units}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAnyTenantSoR ? "Total Units" : "Total Bedrooms"}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary">
                {/* if !SoR, all tenants count as 1 household member */}
                {isAnyTenantSoR ? tenants?.length : tenants?.length > 0 ? 1 : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isAnyTenantSoR ? "Occupied Units" : "Occupied Home"}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {getOccupancyRate(property, tenants, isAnyTenantSoR)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Occupancy Rate
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="success.main">
                {formatCurrency(
                  derieveTotalRent(property, tenants, isAnyTenantSoR),
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Revenue
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
}
