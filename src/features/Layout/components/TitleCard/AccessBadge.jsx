import React from "react";

import { Box, Typography } from "@mui/material";

const AccessBadge = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        right: 12,
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        px: 1,
        py: 0.3,
        borderRadius: "999px",
        backgroundColor: "rgba(0,0,0,0.04)",
        border: "1px solid",
        borderColor: "divider",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "warning.main",
        }}
      />

      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 500,
          color: "text.secondary",
        }}
      >
        Sign in required
      </Typography>
    </Box>
  );
};

export default AccessBadge;
