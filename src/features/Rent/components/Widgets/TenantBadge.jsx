import React from "react";

import { GroupAddRounded, PlusOneRounded } from "@mui/icons-material";
import { Badge, Box, Chip, Stack, Tooltip, Typography } from "@mui/material";

export default function TenantBadge({ tenantsLength }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box>
        {tenantsLength !== 0 ? (
          <Tooltip title="Total number of currently active tenants">
            <Badge badgeContent={tenantsLength} color="error">
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {tenantsLength === 1 ? (
                  <Chip
                    size="small"
                    avatar={<PlusOneRounded fontSize="small" />}
                  />
                ) : (
                  <Chip
                    size="small"
                    avatar={<GroupAddRounded fontSize="small" />}
                  />
                )}
              </Typography>
            </Badge>
          </Tooltip>
        ) : null}
      </Box>
    </Stack>
  );
}
