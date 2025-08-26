import { Home, LocationOnRounded } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";

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
          <Typography variant="h4" gutterBottom>
            {property?.name}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocationOnRounded />
            {property?.address}, {property?.city}, {property?.state}&nbsp;
            {property?.zipcode}
          </Typography>
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
