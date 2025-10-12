import React from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import RowHeader from "common/RowHeader/RowHeader";
import ViewRentalPaymentSummary from "features/Rent/components/Widgets/ViewRentalPaymentSummary";

export default function RentalPaymentOverview({
  isRentListForPropertyLoading,
  rentList,
  propertyName,
  dataTour,
}) {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Payments Overview"
          caption={`View payment summaries for ${propertyName}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        <Stack spacing={2}>
          {isRentListForPropertyLoading ? (
            <Skeleton height="5rem" />
          ) : (
            <ViewRentalPaymentSummary rentData={rentList} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
