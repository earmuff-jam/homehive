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
          {userInfo.firstName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {userInfo.lastName}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        {userInfo.streetAddress}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {userInfo.city} {userInfo.state}, {userInfo.zipcode}
      </Typography>
    </Stack>
  );
}
