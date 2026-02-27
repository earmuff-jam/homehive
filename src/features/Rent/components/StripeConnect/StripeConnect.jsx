import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import {
  HelpOutlineRounded,
  SecurityRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import { Box, Card, Grid, Skeleton } from "@mui/material";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import {
  useCheckStripeAccountStatusQuery,
  useCreateSecureStripeLoginLinkMutation,
  useCreateStripeAccountLinkMutation,
  useCreateStripeAccountMutation,
} from "features/Api/externalIntegrationsApi";
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
import BankAccountInformation from "features/Rent/components/StripeConnect/BankAccountInformation";
import ConnectionAlert from "features/Rent/components/StripeConnect/ConnectionAlert";
import ConnectionButton from "features/Rent/components/StripeConnect/ConnectionButton";
import ConnectionStatus from "features/Rent/components/StripeConnect/ConnectionStatus";
import RecentTransactions from "features/Rent/components/StripeConnect/RecentTransactions";

// stripeConnectOptions ...
// defines constant stripe connect options
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

  const [updateUser, updateUserResult] = useUpdateUserByUidMutation();
  const [createAccount, createAccountResult] = useCreateStripeAccountMutation();
  const [createSecureAccountLink, createSecureAccountLinkResult] =
    useCreateStripeAccountLinkMutation();

  // allow users to change stripe payment info securely
  const [createSecureStripeLoginLink, createSecureStripeLoginLinkResult] =
    useCreateSecureStripeLoginLinkMutation();

  const {
    data: stripeStatus,
    isLoading: isStripeStatusLoading,
    isSuccess: isStripeStatusSuccess,
  } = useCheckStripeAccountStatusQuery(userData?.stripeAccountId, {
    skip: !userData?.stripeAccountId,
  });

  const [stripeAlert, setStripeAlert] = useState(null);
  const [stripeAccountData, setStripeAccountData] = useState(null);

  const isUserConnectedToStripe = userData?.stripeAccountIsActive;

  const handleCreateStripe = () => {
    // connect stripe if there is no previous connection
    if (!userData?.stripeAccountId) {
      createAccount({
        uid: userData?.uid,
        email: userData?.email,
      });
    } else {
      updateUser({
        uid: userData?.uid,
        newData: {
          stripeAccountIsActive: true,
          updatedOn: dayjs().toISOString(),
          updatedBy: user?.uid,
        },
      });
    }
  };

  const handleStripeOnboardingSetup = () => {
    createSecureAccountLink({
      accountId: userData?.stripeAccountId,
    });
  };

  const handleUnlink = () => {
    updateUser({
      uid: userData?.uid,
      newData: {
        stripeAccountIsActive: false,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid,
      },
    });
  };

  const handleManageStripeAccount = () =>
    createSecureStripeLoginLink(userData?.stripeAccountId);

  useEffect(() => {
    if (updateUserResult.isSuccess && !updateUserResult.isLoading) {
      // do smth
    }
  }, [updateUserResult.isLoading]);

  useEffect(() => {
    if (
      createSecureAccountLinkResult.isSuccess &&
      !createSecureAccountLinkResult.isLoading
    ) {
      const secureURL = createSecureAccountLinkResult.data;
      window.open(secureURL, "_blank", "noopener,noreferrer");
      return;
    }
  }, [createSecureAccountLinkResult.isLoading]);

  useEffect(() => {
    if (createAccountResult.isSuccess && !createAccountResult.isLoading) {
      updateUser({
        uid: userData?.uid,
        newData: {
          stripeAccountId: createAccountResult?.data?.accountId,
          stripeAccountType: PropertyOwnerStripeAccountType,
          stripeAccountIsActive: true,
          updatedOn: dayjs().toISOString(),
          updatedBy: user?.uid,
        },
      });
    }
  }, [createAccountResult.isLoading]);

  useEffect(() => {
    if (
      createSecureStripeLoginLinkResult.isSuccess &&
      !createSecureStripeLoginLinkResult.isLoading
    ) {
      const secureURL = createSecureStripeLoginLinkResult.data?.url;
      window.open(secureURL, "_blank", "noopener,noreferrer");
      return;
    }
  }, [createSecureStripeLoginLinkResult.isLoading]);

  useEffect(() => {
    if (!isStripeStatusLoading && isStripeStatusSuccess) {
      const { status, bankAccount } = stripeStatus;

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
    }
  }, [isStripeStatusSuccess]);

  if (isUserDataFromDbLoading || isStripeStatusLoading)
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
                isUserConnectedToStripe={isUserConnectedToStripe}
                handleUnlink={handleUnlink}
              />
            </Box>
          </Box>

          <ConnectionAlert
            stripeAlert={stripeAlert}
            isUserConnectedToStripe={isUserConnectedToStripe}
          />

          <ConnectionButton
            userData={userData}
            stripeAlert={stripeAlert}
            handleCreateStripe={handleCreateStripe}
            isUserConnectedToStripe={isUserConnectedToStripe}
            handleStripeOnboardingSetup={handleStripeOnboardingSetup}
          />
        </Card>
      </Grid>

      {/* Bank Account Information */}
      <Grid item xs={12} md={6}>
        <BankAccountInformation
          stripeAlert={stripeAlert}
          stripeAccountData={stripeAccountData}
          isUserConnectedToStripe={isUserConnectedToStripe}
          handleManageStripeAccount={handleManageStripeAccount}
        />
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
