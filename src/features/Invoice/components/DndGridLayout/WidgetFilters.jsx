import React from "react";

import { Box, Chip, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useGetInvoicesQuery } from "features/Api/invoiceApi";

export default function WidgetFilters({ filters }) {
  const { data: invoices = [], isLoading: isInvoiceListLoading } =
    useGetInvoicesQuery(
      { invoiceIDs: filters?.invoiceIDs },
      { skip: filters?.invoiceIDs?.length <= 0 },
    );

  if (isInvoiceListLoading) return <Skeleton height="100%" />;

  return (
    <Stack spacing={1} padding={1}>
      <Divider>
        <Typography variant="subtitle2">Selected Invoices</Typography>
      </Divider>
      {invoices?.map((invoice) => (
        <Box>
          <Chip label={invoice?.title} />
        </Box>
      ))}
    </Stack>
  );
}
