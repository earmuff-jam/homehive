import React from "react";

import { Box, Chip, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { useGetInvoicesQuery } from "features/Api/invoiceApi";

export default function WidgetFilters({ filters = {} }) {
  const { data: invoices = [], isLoading: isInvoiceListLoading } =
    useGetInvoicesQuery(
      { invoiceIDs: filters?.invoiceIDs },
      { skip: filters?.invoiceIDs?.length <= 0 },
    );

  if (isInvoiceListLoading) return <Skeleton height="100%" />;

  return (
    <Stack spacing={1} padding={1}>
      <Typography variant="subtitle2"> Applied filters </Typography>
      {filters?.invoiceIDs?.length > 0 && (
        <Stack spacing={1} padding={1}>
          <Divider>
            <Typography variant="subtitle2">Selected Invoices</Typography>
          </Divider>
          {invoices?.map((invoice) => (
            <Box key={invoice?.id}>
              <Chip size="small" label={invoice?.title} color="primary" />
            </Box>
          ))}
        </Stack>
      )}

      {filters?.chartType && (
        <Stack spacing={1} padding={1}>
          <Divider>
            <Typography variant="subtitle2">Chart Variant</Typography>
          </Divider>
          <Box>
            <Chip
              size="small"
              label={`${filters?.chartType} chart`}
              color="primary"
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
