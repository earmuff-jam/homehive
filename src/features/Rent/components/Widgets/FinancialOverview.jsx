import React from "react";

import { Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import RowHeader from "common/RowHeader";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";
import { formatCurrency } from "features/Rent/utils";

export default function FinancialOverview({
  isTenantsLoading,
  property,
  tenants,
  dataTour,
}) {
  const { totalRent } = useSelectedPropertyDetails(property, tenants);

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Financial Overview"
          caption={`View financial details for ${property?.name}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        {isTenantsLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }}>
              <Stack textAlign="center" flexGrow={1}>
                <Typography
                  variant="subtitle2"
                  color="success"
                  sx={{ fontSize: "2rem" }}
                >
                  ${formatCurrency(totalRent)}
                  <Typography component="span" variant="caption">
                    {` USD / m`}
                  </Typography>
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Monthly Revenue
                </Typography>
              </Stack>
              <Stack textAlign="center" flexGrow={1}>
                <Typography
                  variant="subtitle2"
                  color="success"
                  sx={{ fontSize: "2rem" }}
                >
                  ${formatCurrency(totalRent * 12)}
                  <Typography component="span" variant="caption">
                    {` USD / yr`}
                  </Typography>
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Projected Annual Revenue
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
