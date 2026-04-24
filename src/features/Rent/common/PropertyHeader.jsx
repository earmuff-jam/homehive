import React, { useState } from "react";

import { CommentRounded, Home, HomeWorkOutlined } from "@mui/icons-material";
import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import AIconButton from "common/AIconButton";

export default function PropertyHeader({
  property,
  isRentee = false,
  isPrimaryRenter = false,
}) {
  const [showNote, setShowNote] = useState(false);

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
                  <Chip
                    size="small"
                    label={`${property?.sqFt} sq.ft`}
                    color="primary"
                  />
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
          <Stack direction="row" alignItems="center" spacing={1} padding={1}>
            <Tooltip title={showNote ? "Hide notes" : "Show notes"}>
              <AIconButton
                size="small"
                onClick={() => setShowNote(!showNote)}
                label={<CommentRounded fontSize="small" color="info" />}
              />
            </Tooltip>
            {showNote && (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                  paddingX: 2,
                  paddingY: 0.1,
                  borderRadius: 1,
                }}
              >
                {property?.note}
              </Typography>
            )}
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
