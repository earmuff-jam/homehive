import dayjs from "dayjs";

import { Box, Stack, Typography } from "@mui/material";
import { TRentRowHeader } from "features/Rent/types/Rent.types";

export default function RowHeader({
  title,
  caption,
  showDate = false,
  createdDate = dayjs(),
  sxProps,
  children,
}: TRentRowHeader) {
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
