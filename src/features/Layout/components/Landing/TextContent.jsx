import React from "react";

import { Stack, Typography } from "@mui/material";

export default function TextContent({ title, caption }) {
  return (
    <Stack>
      <Typography sx={{ fontSize: "2rem" }}>{title}</Typography>
      <Typography variant="body2">{caption}</Typography>
    </Stack>
  );
}
