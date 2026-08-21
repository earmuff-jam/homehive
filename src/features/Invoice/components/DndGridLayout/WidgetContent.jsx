import React from "react";

import { EditRounded } from "@mui/icons-material";
import { Skeleton, Stack, Typography } from "@mui/material";
import { useGetInvoiceQuery } from "features/Api/invoiceApi";
import WidgetContentWrapper from "features/Invoice/components/DndGridLayout/WidgetContentWrapper";

export default function WidgetContent({ widget }) {
  const selectedInvoiceID = widget?.filters?.selectedInvoiceID;

  const { data: invoice = {}, isLoading: isInvoiceListLoading } =
    useGetInvoiceQuery(
      { invoiceID: selectedInvoiceID },
      { skip: !selectedInvoiceID },
    );

  if (isInvoiceListLoading) return <Skeleton height="5rem" />;

  if (!selectedInvoiceID) {
    return (
      <Stack alignItems="center" justifyContent="center" margin="5rem">
        <EditRounded
          sx={{
            fontSize: "5rem",
            color: "primary.lightBackground",
          }}
        />
        <Typography variant="subtitle2" color="textSecondary">
          Select an invoice to begin
        </Typography>
      </Stack>
    );
  }

  return <WidgetContentWrapper type={widget?.type} data={invoice} />;
}
