import dayjs from "dayjs";

import { Box, Stack, Typography } from "@mui/material";
import { TInvoiceRowHeader } from "features/Invoice/types/Invoice.types";

export default function InvoiceRowHeader({
  title,
  caption,
  showDate = false,
  createdDate = dayjs(),
  sxProps,
  children,
}: TInvoiceRowHeader) {
  return (
    <Stack>
      <Stack textAlign="center" sx={sxProps} alignContent="center">
        <Typography variant="h5" fontWeight="medium" sx={sxProps}>
          {title}
        </Typography>
        {caption ? (
          <Typography variant="subtitle2">{caption}</Typography>
        ) : null}
        <Box sx={{ alignSelf: "flex-end" }}>{children}</Box>
      </Stack>
      {showDate && (
        <Typography
          data-testid="createdDate"
          variant="subtitle2"
          fontStyle={"italic"}
          textAlign={"right"}
        >
          Created on {createdDate.format("MM-DD-YYYY")}
        </Typography>
      )}
    </Stack>
  );
}
