import React from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import RowHeader from "common/RowHeader/RowHeader";
import ViewDocuments from "features/Rent/components/Widgets/ViewDocuments";

export default function DocumentsOverview({
  isPropertyLoading,
  property,
  dataTour,
}) {
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Documents Overview"
          caption={`View documents assoicated with ${property?.name}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        <Stack spacing={2}>
          {isPropertyLoading ? <Skeleton height="5rem" /> : <ViewDocuments />}
        </Stack>
      </CardContent>
    </Card>
  );
}
