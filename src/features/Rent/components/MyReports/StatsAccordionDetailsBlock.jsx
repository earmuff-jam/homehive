import React from "react";

import { Box, Typography } from "@mui/material";

// StatsAccordionDetailsBlock ...
// defines the function that renders the details for each statistics
const StatsAccordionDetailsBlock = ({
  label,
  value,
  caption,
  applyVariant = false,
}) => {
  return (
    <Box
      sx={{
        paddingX: 4,
        paddingY: 2,
        flex: 1,
        bgcolor: "background.default",
        textAlign: "center",
        borderRadius: 0.8,
      }}
    >
      <Typography
        variant="subtitle2"
        textTransform="uppercase"
        color="text.secondary"
        fontWeight={applyVariant ? "bold" : null}
      >
        {label}
      </Typography>
      <Typography
        fontSize="1.875rem"
        color={applyVariant ? "primary" : null}
        textTransform="capitalize"
      >
        {value}
      </Typography>
      <Typography variant="caption" fontWeight={applyVariant ? "bold" : null}>
        {caption}
      </Typography>
    </Box>
  );
};

export default StatsAccordionDetailsBlock;
