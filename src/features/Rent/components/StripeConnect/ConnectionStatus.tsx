import { ErrorOutlineRounded, LinkOffRounded } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { TStripeAlert } from "features/Rent/Rent.types";
import { StripeUserStatusEnums } from "features/Rent/components/Settings/common";

export type TConnectionStatusProps = {
  stripeAlert: TStripeAlert;
  isStripeConnected?: boolean;
  isUserConnectedToStripe?: boolean; // TODO: investigate these stuffs.
  handleUnlink: () => void;
};

export default function ConnectionStatus({
  stripeAlert,
  isStripeConnected = false,
  isUserConnectedToStripe = false,
  handleUnlink,
}: TConnectionStatusProps) {
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

        <Tooltip title="Connect Stripe">
          <IconButton
            size="small"
            color={!stripeAlert && isStripeConnected ? "success" : "error"}
            onClick={handleUnlink}
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
              onClick={handleUnlink}
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
            onClick={handleUnlink}
            // disable link if verification started, but allow modifications
            // TODO: fix this
            disabled={stripeAlert?.type === StripeUserStatusEnums.FAILURE.type}
          >
            <LinkOffRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      );
    }
  }
}
