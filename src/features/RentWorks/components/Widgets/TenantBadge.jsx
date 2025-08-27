import { GroupOutlined } from "@mui/icons-material";
import { Badge, Box, Stack, Tooltip, Typography } from "@mui/material";

export default function TenantBadge({ tenantsLength }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box>
        {tenantsLength !== 0 ? (
          <Tooltip title="Total number of currently active tenants">
            <Badge badgeContent={tenantsLength} color="textSecondary">
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <GroupOutlined color="info" />
              </Typography>
            </Badge>
          </Tooltip>
        ) : null}
      </Box>
    </Stack>
  );
}
