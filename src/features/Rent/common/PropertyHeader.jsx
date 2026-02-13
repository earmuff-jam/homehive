import React from "react";

import { Home, HomeWorkOutlined } from "@mui/icons-material";
import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";

export default function PropertyHeader({
  property,
  isRentee = false,
  isPrimaryRenter = false,
}) {
  return (
    <Stack spacing={1}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Home color="primary" sx={{ fontSize: 40 }} />
        <Stack>
          <Typography variant="h4">{property?.name}</Typography>
          <Stack
            spacing={1}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "left", sm: "center" }}
          >
            {property?.isHoa && (
              <Tooltip title={`${property?.hoaDetails}`}>
                <HomeWorkOutlined fontSize="small" color="info" />
              </Tooltip>
            )}
            {property?.sqFt && (
              <Box>
                <Tooltip title={`${property?.sqFt} sq.ft `}>
                  <Chip size="small" label={`${property?.sqFt} sq.ft`} />
                </Tooltip>
              </Box>
            )}
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {property?.address}, {property?.city}, {property?.state}&nbsp;
              {property?.zipcode}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {isRentee ? (
        <Box>
          {isPrimaryRenter ? (
            <Chip label="Primary Renter" />
          ) : (
            <Chip label="Secondary Renter" />
          )}
        </Box>
      ) : null}
    </Stack>
  );
}
