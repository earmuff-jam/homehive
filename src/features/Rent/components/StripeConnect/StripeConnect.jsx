import { useEffect, useState } from "react";
import React from "react";

import dayjs from "dayjs";

import {
  CheckRounded,
  HelpOutlineRounded,
  SecurityRounded,
  SettingsRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import RowHeader from "common/RowHeader/RowHeader";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import {
  PropertyOwnerStripeAccountType,
  StripeUserStatusEnums,
  getStripeFailureReasons,
} from "features/Rent/components/Settings/common";
import ConnectionAlert from "features/Rent/components/StripeConnect/ConnectionAlert";
import ConnectionButton from "features/Rent/components/StripeConnect/ConnectionButton";
import ConnectionStatus from "features/Rent/components/StripeConnect/ConnectionStatus";
import RecentTransactions from "features/Rent/components/StripeConnect/RecentTransactions";
import { useCheckStripeAccountStatus } from "features/Rent/hooks/useCheckStripeAccountStatus";
import {
  useCreateLoginLinkStripeAccount,
  useCreateStripeAccount,
  useCreateStripeAccountLink,
} from "features/Rent/hooks/useStripe";
import { fetchLoggedInUser } from "features/Rent/utils";

export default function StripeConnect() {
  const user = fetchLoggedInUser();
  const { data: userData, isLoading: isUserDataFromDbLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const [updateUser] = useUpdateUserByUidMutation();

  const { createAccount } = useCreateStripeAccount();
  const { createAccountLink } = useCreateStripeAccountLink();

  // check account status from stripe
  const { checkStatus, loading: isCheckStripeAccountStatusLoading } =
    useCheckStripeAccountStatus();

  // allow users to change stripe payment info securely
  const { createStripeLoginLink } = useCreateLoginLinkStripeAccount();

  const [stripeAlert, setStripeAlert] = useState(null);
  const [stripeAccountData, setStripeAccountData] = useState(null);

  const handleCreateStripe = async () => {
    // connect stripe if there is no previous connection
    if (!userData?.stripeAccountId) {
      const data = await createAccount({
        uid: userData?.uid,
        email: userData?.googleEmailAddress,
      });
      if (data) {
        updateUser({
          uid: userData?.uid,
          newData: {
            stripeAccountId: data.accountId,
            stripeAccountType: PropertyOwnerStripeAccountType,
            stripeAccountIsActive: true, // used to link / unlink account
            updatedOn: dayjs().toISOString(),
            updatedBy: user?.uid,
          },
        });
      }
    } else {
      updateUser({
        uid: userData?.uid,
        newData: {
          stripeAccountIsActive: true, // used to link / unlink account
          updatedOn: dayjs().toISOString(),
          updatedBy: user?.uid,
        },
      });
    }
  };

  const handleDisconnectStripe = async () => {
    await updateUser({
      uid: userData?.uid,
      newData: {
        stripeAccountIsActive: false,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid, // from local storage
      },
    });
  };

  const handleStripeOnboardingSetup = async () => {
    const secureURL = await createAccountLink({
      accountId: userData?.stripeAccountId,
    });

    window.open(secureURL, "_blank", "noopener,noreferrer");
    return;
  };

  const handleManageStripeAccount = async () => {
    const secureURL = await createStripeLoginLink({
      accountId: userData.stripeAccountId,
    });

    window.open(secureURL, "_blank", "noopener,noreferrer");
    return;
  };

  useEffect(() => {
    const handleCheckStripeStatus = async (id) => {
      const { status, bankAccount } = await checkStatus({ accountId: id });

      if (bankAccount) {
        setStripeAccountData({
          stripeAccountHolderName: bankAccount?.stripeAccountHolderName,
          stripeAccountHolderLastFour: bankAccount?.stripeAccountHolderLastFour,
          stripeAccountType: bankAccount?.stripeAccountType,
          stripeRoutingNumber: bankAccount?.stripeRoutingNumber,
          stripeBankAccountName: bankAccount?.stripeBankAccountName,
          stripeBankAccountCountry: bankAccount?.stripeBankAccountCountry,
          stripeBankAccountCurrencyMode:
            bankAccount?.stripeBankAccountCurrencyMode,
        });
      }

      if (status) {
        if (
          status.details_submitted &&
          status.charges_enabled &&
          status.payouts_enabled
        ) {
          setStripeAlert({
            type: StripeUserStatusEnums.SUCCESS.type,
            label: StripeUserStatusEnums.SUCCESS.label,
            msg: StripeUserStatusEnums.SUCCESS.msg,
          });
        } else {
          const reasons = getStripeFailureReasons(status);
          setStripeAlert({
            type: StripeUserStatusEnums.FAILURE.type,
            label: StripeUserStatusEnums.FAILURE.label,
            msg: StripeUserStatusEnums.FAILURE.msg,
            reasons: reasons,
          });
        }
      }
    };

    // only check if stripeAccountId is present
    if (userData?.stripeAccountId) {
      handleCheckStripeStatus(userData.stripeAccountId);
    }
  }, [userData?.stripeAccountId]);

  if (isUserDataFromDbLoading || isCheckStripeAccountStatusLoading)
    return <Skeleton height="10rem" />;

  return (
    <Grid container spacing={1}>
      {/* Connection Status Card */}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ p: 1, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <RowHeader
              title="Account Connection"
              caption="View details about your financial institution"
              sxProps={{ textAlign: "left" }}
            />
            <Box
              sx={{
                ml: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ConnectionStatus
                stripeAlert={stripeAlert}
                isUserConnectedToStripe={userData?.stripeAccountIsActive}
                handleDisconnectStripe={handleDisconnectStripe}
              />
            </Box>
          </Box>

          <ConnectionAlert
            stripeAlert={stripeAlert}
            isUserConnectedToStripe={userData?.stripeAccountIsActive}
          />

          <ConnectionButton
            userData={userData}
            stripeAlert={stripeAlert}
            handleCreateStripe={handleCreateStripe}
            isUserConnectedToStripe={userData?.stripeAccountIsActive}
            handleStripeOnboardingSetup={handleStripeOnboardingSetup}
          />
        </Card>
      </Grid>

      {/* Bank Account Information */}
      <Grid item xs={12} md={6}>
        <Card elevation={0} sx={{ p: 3, height: "100%" }}>
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
                Connect your Stripe account to view payout information and
                manage your bank account details.
              </Typography>
              <Alert severity="warning" size="small">
                You&apos;ll need to complete identity verification and add a
                bank account in Stripe before you can receive payments.
              </Alert>
            </Box>
          )}
        </Card>
      </Grid>

      {/* Transaction History Preview */}
      <Grid item xs={12}>
        <RecentTransactions />
      </Grid>

      {/* Help & Support */}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ p: 3, bgcolor: "background.paper" }}>
          <RowHeader
            title="Need Help?"
            caption="Select how can we help you best."
            sxProps={{ textAlign: "left" }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <HelpOutlineRounded
                  sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                />
                <Typography variant="subtitle2" fontWeight={600}>
                  Setup Guide
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Instructions for connecting Stripe
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      "https://dashboard.stripe.com/register/connect",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  View Guide
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <SupportAgentRounded
                  sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                />
                <Typography variant="subtitle2" fontWeight={600}>
                  Contact Support
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Stripe Help and Support
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      "https://support.stripe.com/",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <SecurityRounded
                  sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                />
                <Typography variant="subtitle2" fontWeight={600}>
                  Security & Compliance
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Learn about PCI compliance
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      "https://stripe.com/guides/pci-compliance",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}
