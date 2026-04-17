import React from "react";

import { Stack } from "@mui/material";
import StripeConnect from "features/Rent/components/StripeConnect/StripeConnect";

export default function ExternalIntegrations() {
  return (
    <Stack alignItems="center" spacing={1}>
      <Stack width="100%">
        <StripeConnect />
      </Stack>
    </Stack>
  );
}
