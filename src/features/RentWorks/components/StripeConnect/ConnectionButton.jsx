import React from "react";

import { AccountBalanceRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import { StripeUserStatusEnums } from "features/RentWorks/components/Settings/common";

export default function ConnectionButton({
  userData,
  stripeAlert,
  handleCreateStripe,
  isUserConnectedToStripe,
  handleStripeOnboardingSetup,
}) {
  // first time user or disconnected user
  if (!stripeAlert || !isUserConnectedToStripe) {
    return (
      <AButton
        size="medium"
        sx={{ mt: 2 }}
        variant="contained"
        onClick={handleCreateStripe}
        startIcon={<AccountBalanceRounded />}
        label="Link Stripe"
      />
    );
  } else if (stripeAlert?.type === StripeUserStatusEnums.FAILURE.type) {
    return (
      <AButton
        size="medium"
        sx={{ mt: 2 }}
        variant="contained"
        onClick={handleStripeOnboardingSetup}
        startIcon={<AccountBalanceRounded />}
        label="Complete your onboarding"
      />
    );
  } else if (
    isUserConnectedToStripe &&
    stripeAlert.type === StripeUserStatusEnums?.SUCCESS?.type
  ) {
    return (
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Your Stripe account is connected. Verify your stripe account details.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Stack>
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Account ID:
            </Typography>
            <Typography variant="body2" color="error">
              {userData?.stripeAccountId}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant="body2" color="textPrimary" fontWeight="bold">
              Status
            </Typography>
            <Typography variant="body2" color="info">
              {userData?.stripeAccountType}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  }
  return null;
}
