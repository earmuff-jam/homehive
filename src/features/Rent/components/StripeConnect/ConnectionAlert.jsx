import React from "react";

import { Alert, Stack, Typography } from "@mui/material";

export default function ConnectionAlert({
  stripeAlert,
  isUserConnectedToStripe,
}) {
  // first time user || disconnected user
  if (!stripeAlert || !isUserConnectedToStripe) {
    return (
      <Alert severity="info">
        <Typography variant="body2">
          Connect your Stripe account to enable online rent payments from your
          tenants. Stripe handles secure payment processing and deposits funds
          directly to your bank account.
        </Typography>
      </Alert>
    );
  } else if (stripeAlert) {
    return (
      <Alert severity={stripeAlert?.type}>
        {stripeAlert?.msg}
        {stripeAlert?.reasons?.length > 0 && (
          <Stack sx={{ mt: 1 }}>
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              {stripeAlert?.reasons?.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </Stack>
        )}
      </Alert>
    );
  }
}
