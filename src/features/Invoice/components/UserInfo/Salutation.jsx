import React from "react";

import { Stack, Typography } from "@mui/material";

export default function Salutation({ userInfo, isEnd = false }) {
  return (
    <Stack sx={{ my: 4 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {isEnd ? "Thank you," : "To,"}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          {userInfo.first_name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {userInfo.last_name}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        {userInfo.street_address}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {userInfo.city} {userInfo.state}, {userInfo.zipcode}
      </Typography>
    </Stack>
  );
}
