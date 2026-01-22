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
import RowHeader from "common/RowHeader";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import HelpAndSupport from "features/Rent/components/ExternalIntegrations/HelpAndSupport";
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

const stripeConnectOptions = [
  {
    id: 1,
    title: "Setup guide",
    caption: "Instructions for connecting Stripe",
    icon: (
      <HelpOutlineRounded sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
    ),
    buttonText: "View guide",
    to: "https://dashboard.stripe.com/register/connect",
  },
  {
    id: 2,
    title: "Contact Support",
    caption: "Stripe help and support",
    icon: (
      <SupportAgentRounded
        sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
      />
    ),
    buttonText: "Contact us",
    to: "https://support.stripe.com/",
  },
  {
    id: 3,
    title: "Security & Compliance",
    caption: "Learn about PCI compliance",
    icon: (
      <SecurityRounded sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
    ),
    buttonText: "View Compliance",
    to: "https://stripe.com/guides/pci-compliance",
  },
];

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
        email: userData?.email,
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

  const handleUnlink = async () => {
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

    if (userData?.stripeAccountId) {
      handleCheckStripeStatus(userData.stripeAccountId);
    }
  }, [userData?.stripeAccountId]);

  if (isUserDataFromDbLoading || isCheckStripeAccountStatusLoading)
    return <Skeleton height="10rem" width="100%" />;

  return (
    <Grid container spacing={1}>
      {/* Connection Status Card */}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ p: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
                handleUnlink={handleUnlink}
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
        <Card elevation={0} sx={{ p: 1, height: "100%" }}>
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
        <HelpAndSupport options={stripeConnectOptions} />
      </Grid>
    </Grid>
  );
}
