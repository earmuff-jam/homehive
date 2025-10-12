import React from "react";

import { Stack, Typography } from "@mui/material";

function Footer() {
  return (
    <Stack
      sx={{ textAlign: "center", mt: 1, color: "#bbb" }}
      className="no-print"
    >
      <Typography> Earmuffjam LLC. All rights reserved. @2024</Typography>
    </Stack>
  );
}

export default Footer;
