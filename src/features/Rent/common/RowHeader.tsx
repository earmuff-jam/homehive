import { ReactNode } from "react";

import dayjs, { Dayjs } from "dayjs";

import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";

// TRentRowHeader ...
export type TRentRowHeader = {
  title: string;
  caption?: string | ReactNode;
  showDate?: boolean;
  createdDate?: Dayjs;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
};

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
