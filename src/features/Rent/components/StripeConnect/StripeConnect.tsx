import { useEffect, useState } from "react";

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
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { THelpAndSupport } from "common/types";
import { fetchLoggedInUser } from "common/utils";
import {
  useCheckStripeAccountStatusMutation,
  useCreateStripeAccountLinkMutation,
  useCreateStripeAccountMutation,
  useCreateStripeLoginLinkMutation,
} from "features/Api/externalIntegrationsApi";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import { TStripeAlert } from "features/Rent/Rent.types";
import HelpAndSupport from "features/Rent/common/HelpAndSupport";
import RowHeader from "features/Rent/common/RowHeader";
import {
  StripeUserStatusEnums,
  getStripeFailureReasons,
} from "features/Rent/components/Settings/common";
import ConnectionAlert from "features/Rent/components/StripeConnect/ConnectionAlert";
import ConnectionButton from "features/Rent/components/StripeConnect/ConnectionButton";
import ConnectionStatus from "features/Rent/components/StripeConnect/ConnectionStatus";
import RecentTransactions from "features/Rent/components/StripeConnect/RecentTransactions";
import { TUser } from "src/types";

const stripeConnectOptions: THelpAndSupport[] = [
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
  const user: TUser = fetchLoggedInUser();
  const { data: userData, isLoading: isUserDataFromDbLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const [updateUser, updateUserResult] = useUpdateUserByUidMutation();

  const [createStripeAccount, createStripeAccountResult] =
    useCreateStripeAccountMutation();

  const [createAccountLink, createAccountLinkResult] =
    useCreateStripeAccountLinkMutation();

  const [checkStripeAccountStatus, checkStripeAccountStatusResult] =
    useCheckStripeAccountStatusMutation();

  const [createSecureStripeLoginLink, createSecureStripeLoginLinkResult] =
    useCreateStripeLoginLinkMutation();
  // check account status from stripe
  // const { checkStatus, loading: isCheckStripeAccountStatusLoading } =
  //   useCheckStripeAccountStatus();

  // allow users to change stripe payment info securely
  // const { createStripeLoginLink } = useCreateLoginLinkStripeAccount();

  const [stripeAccountData, setStripeAccountData] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [stripeAlert, setStripeAlert] = useState<TStripeAlert | null>(null);

  const handleCreateStripe = () => {
    // connect stripe if there is no previous connection
    if (!userData?.stripeAccountId && userData?.email) {
      createStripeAccount(userData.email);
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

  const handleUnlink = () => {
    updateUser({
      uid: userData?.uid,
      newData: {
        stripeAccountIsActive: false,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid, // from local storage
      },
    });
  };

  const handleStripeOnboardingSetup = () => {
    createAccountLink({
      accountId: userData?.stripeAccountId,
    });
  };

  const handleManageStripeAccount = () => {
    createSecureStripeLoginLink({
      accountId: userData.stripeAccountId,
    });
  };

  useEffect(() => {
    if (createAccountLinkResult.isSuccess) {
      window.open(
        createAccountLinkResult.data,
        "_blank",
        "noopener,noreferrer",
      );
    }
  }, [createAccountLinkResult.isLoading]);

  useEffect(() => {
    if (createStripeAccountResult.isSuccess) {
      updateUser({
        uid: userData?.uid,
        newData: {
          stripeAccountId: createStripeAccountResult.data.accountId,
          stripeAccountIsActive: true, // used to link / unlink account
          updatedOn: dayjs().toISOString(),
          updatedBy: user?.uid,
        },
      });
    }
  }, [createStripeAccountResult.isLoading]);

  useEffect(() => {
    if (createSecureStripeLoginLinkResult.isSuccess) {
      window.open(
        createSecureStripeLoginLinkResult.data,
        "_blank",
        "noopener,noreferrer",
      );
    }
  }, [createSecureStripeLoginLinkResult.isLoading]);

  useEffect(() => {
    userData?.stripeAccountIsActive &&
      checkStripeAccountStatus(userData?.stripeAccountId);
  }, [userData?.stripeAccountId]);

  useEffect(() => {
    if (checkStripeAccountStatusResult.isSuccess) {
      const { status, bankAccount } = checkStripeAccountStatusResult.data;

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
            message: StripeUserStatusEnums.SUCCESS.message,
          });
        } else {
          const reasons = getStripeFailureReasons(status);
          setStripeAlert({
            type: StripeUserStatusEnums.FAILURE.type,
            label: StripeUserStatusEnums.FAILURE.label,
            message: StripeUserStatusEnums.FAILURE.message,
            reasons: reasons,
          });
        }
      }
    }
  }, [checkStripeAccountStatusResult.isLoading]);

  useEffect(() => {
    if (updateUserResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [updateUserResult.isLoading]);

  if (isUserDataFromDbLoading || checkStripeAccountStatusResult.isLoading)
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
              <Alert severity="warning">
                You&apos;ll need to complete identity verification and add a
                bank account in Stripe before you can receive payments.
              </Alert>
            </Box>
          )}
        </Card>
      </Grid>

      {/* Transaction History Preview */}
      <Grid item xs={12}>
        <RecentTransactions transactions={[]} loading={false} />
      </Grid>

      {/* Help & Support */}
      <Grid item xs={12}>
        <HelpAndSupport options={stripeConnectOptions} />
      </Grid>

      <CustomSnackbar
        severity="success"
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Action completed."
      />
    </Grid>
  );
}
