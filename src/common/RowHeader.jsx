import React from "react";

import dayjs from "dayjs";

import { Box, Stack, Typography } from "@mui/material";

export default function RowHeader({
  title,
  caption,
  showDate = false,
  createdDate = dayjs().format("DD-MM-YYYY"),
  sxProps,
  children,
}) {
  return (
    <>
      <Stack textAlign="center" {...sxProps} alignContent="center">
        <Typography variant="h5" fontWeight="medium" {...sxProps}>
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
          Created on {createdDate}
        </Typography>
      )}
    </>
  );
}
