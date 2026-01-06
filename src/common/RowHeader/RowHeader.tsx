import dayjs from "dayjs";

import { Box, Stack, Typography } from "@mui/material";
import { TInvoiceRowHeader } from "features/Invoice/types/Invoice.types";

// invoice row header created. rent row header remain
export default function RowHeader({
  title,
  caption,
  showDate = false,
  createdDate = dayjs(),
  sxProps,
  children,
}: TInvoiceRowHeader) {
  return (
    <>
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
          variant="subtitle2"
          fontStyle={"italic"}
          textAlign={"right"}
        >
          Created on {createdDate.format("MM-DD-YYYY")}
        </Typography>
      )}
    </>
  );
}
