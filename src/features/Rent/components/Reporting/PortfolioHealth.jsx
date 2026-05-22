import React from "react";

import { Box, Stack, Typography } from "@mui/material";
import { pluralize } from "common/utils";

// PortfolioHealthBlock ...
// defines a function that calculates portfolio health
const PortfolioHealthBlock = ({ data, label = "" }) => {
  return (
    <Box
      sx={{
        paddingX: 4,
        paddingY: 2,
        bgcolor: "background.default",
        textAlign: "center",
        borderRadius: 0.8,
      }}
    >
      <Typography>{data}</Typography>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
};

const PortfolioHealth = ({ portfolioHealth }) => {
  return (
    <Stack
      spacing={2}
      justifyContent="center"
      direction={{ sm: "row", xs: "column" }}
    >
      <PortfolioHealthBlock
        data={portfolioHealth?.totalProperties || 0}
        label={`Total ${pluralize(portfolioHealth?.totalProperties, "property")}`}
      />
      <PortfolioHealthBlock
        data={portfolioHealth?.vacantProperties || 0}
        label={`Vacant ${pluralize(portfolioHealth?.vacantProperties, "property")}`}
      />
    </Stack>
  );
};

export default PortfolioHealth;
