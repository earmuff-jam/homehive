import React from "react";

import { CheckRounded, SettingsRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { StripeUserStatusEnums } from "features/Rent/components/Settings/common";

export default function BankAccountInformation({
  stripeAlert,
  stripeAccountData,
  isUserConnectedToStripe,
  handleManageStripeAccount,
}) {
  return (
    <Card elevation={0} sx={{ padding: 1, height: "100%" }}>
      <RowHeader
        title="Bank Account Information"
        caption="View details about your connected bank account."
        sxProps={{
          fontSize: "0.875rem",
          fontWeight: "bold",
          textAlign: "left",
        }}
      />
      {/* If stripe is not connected ( stripe alert inactive ) or if stripe verification has failed */}
      {stripeAlert &&
      stripeAlert?.type !== StripeUserStatusEnums.FAILURE.type ? (
        <>
          <Paper>
            {!isUserConnectedToStripe ? (
              <EmptyComponent
                caption="Connect stripe to view bank details"
                sxProps={{ variant: "subtitle2" }}
              />
            ) : (
              <Stack spacing={1} sx={{ padding: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1}>
                    <CheckRounded color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      {stripeAccountData?.stripeBankAccountName || "******"}
                    </Typography>
                  </Stack>
                  <Box>
                    <Chip
                      label={
                        stripeAccountData?.stripeBankAccountCurrencyMode.toUpperCase() ||
                        ""
                      }
                      color="primary"
                    />
                  </Box>
                </Stack>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last 4 Bank Account:</strong>&nbsp;
                    {stripeAccountData?.stripeAccountHolderLastFour || "****"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Bank Routing Number:</strong>&nbsp;
                    {stripeAccountData?.stripeRoutingNumber || "******"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Account Holder Name:</strong>&nbsp;
                    {stripeAccountData?.stripeAccountHolderName || "*******"}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Paper>
          <Stack sx={{ marginTop: "1rem" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SettingsRounded />}
              onClick={handleManageStripeAccount}
            >
              Manage in Stripe Dashboard
            </Button>
          </Stack>
        </>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect your Stripe account to view payout information and manage
            your bank account details.
          </Typography>
          <Alert severity="warning" size="small">
            You&apos;ll need to complete identity verification and add a bank
            account in Stripe before you can receive payments.
          </Alert>
        </Box>
      )}
    </Card>
  );
}
