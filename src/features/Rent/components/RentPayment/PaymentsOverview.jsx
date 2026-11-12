import React from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import RowHeader from "common/RowHeader";
import PaymentsTable from "features/Rent/components/RentPayment/PaymentsTable";

export default function PaymentsOverview({
  isPropertyOwner = false,
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
            <PaymentsTable
              rentData={rentList}
              propertyName={propertyName}
              isPropertyOwner={isPropertyOwner}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
