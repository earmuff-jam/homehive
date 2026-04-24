import React from "react";

import { Home, HomeWorkOutlined } from "@mui/icons-material";
import {
  Box,
  Chip,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function PropertyHeader({
  property,
  isRentee = false,
  isPrimaryRenter = false,
}) {
  const theme = useTheme();
  const isGtSmallFormFactor = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Stack spacing={1}>
      <Stack>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Home color="primary" sx={{ fontSize: 40 }} />
          <Stack>
            <Typography variant="h4">{property?.name}</Typography>
            <Stack
              spacing={1}
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "left", sm: "flex-end" }}
            >
              <Stack direction="row" spacing={1}>
                {property?.isHoa && (
                  <Tooltip title={`${property?.hoaDetails}`}>
                    <HomeWorkOutlined fontSize="small" color="info" />
                  </Tooltip>
                )}
                {property?.sqFt && (
                  <Box>
                    <Tooltip title={`${property?.sqFt} sq.ft `}>
                      <Chip
                        size="small"
                        label={`${property?.sqFt} sq.ft`}
                        color="primary"
                      />
                    </Tooltip>
                  </Box>
                )}
              </Stack>
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

        <Stack direction="row" alignItems="center" spacing={1} paddingY={1}>
          <Tooltip title={isGtSmallFormFactor ? "" : property?.note}>
            <Typography
              flexGrow={1}
              variant="subtitle2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                alignContent: "center",
                textOverflow: "ellipsis",
                whiteSpace: isGtSmallFormFactor ? "none" : "nowrap",
                maxWidth: isGtSmallFormFactor ? "inherit" : 250,
              }}
            >
              {property?.note}
            </Typography>
          </Tooltip>
        </Stack>
      </Stack>

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
