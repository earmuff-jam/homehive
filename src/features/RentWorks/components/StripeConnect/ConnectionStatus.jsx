import React from "react";

import { ErrorOutlineRounded, LinkOffRounded } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { StripeUserStatusEnums } from "features/RentWorks/components/Settings/common";

export default function ConnectionStatus({
  stripeAlert,
  isStripeConnected = false,
  isUserConnectedToStripe = false,
  handleDisconnectStripe,
}) {
  if (!isUserConnectedToStripe) {
    return (
      <Chip
        label="Not Connected"
        color="default"
        size="small"
        sx={{ padding: "0.5rem" }}
        icon={<ErrorOutlineRounded fontSize="small" color="error" />}
      />
    );
  }

  if (!stripeAlert) {
    return (
      <>
        <Chip
          label="Not Connected"
          color="default"
          size="small"
          sx={{ padding: "0.5rem" }}
          icon={<ErrorOutlineRounded fontSize="small" color="error" />}
        />

        <Tooltip title="Disconnect Stripe">
          <IconButton
            size="small"
            color={!stripeAlert && isStripeConnected ? "success" : "error"}
            onClick={handleDisconnectStripe}
            // disable link if verification started, but allow modifications
            disabled={stripeAlert?.type === StripeUserStatusEnums.FAILURE.type}
          >
            <LinkOffRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    );
  } else if (stripeAlert) {
    if (stripeAlert.type === StripeUserStatusEnums.FAILURE.type) {
      return (
        <>
          <Chip
            label="Not onboarded"
            color="default"
            size="small"
            sx={{ padding: "0.5rem" }}
            icon={<ErrorOutlineRounded fontSize="small" color="error" />}
          />
          <Tooltip title="Disconnect Stripe">
            <IconButton
              size="small"
              color={!stripeAlert && isStripeConnected ? "success" : "error"}
              onClick={handleDisconnectStripe}
              // disable link if verification started, but allow modifications
              disabled={
                stripeAlert?.type === StripeUserStatusEnums.FAILURE.type
              }
            >
              <LinkOffRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      );
    } else {
      return (
        <Tooltip title="Disconnect Stripe">
          <IconButton
            size="small"
            color={!stripeAlert && isStripeConnected ? "success" : "error"}
            onClick={handleDisconnectStripe}
            // disable link if verification started, but allow modifications
            disabled={stripeAlert?.type === StripeUserStatusEnums.FAILURE.type}
          >
            <LinkOffRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
  }
}
