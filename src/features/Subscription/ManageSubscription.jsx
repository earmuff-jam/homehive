import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { PaymentRounded } from "@mui/icons-material";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import { fetchLoggedInUser } from "common/utils";
import {
  useCreateStripeCustomerLinkMutation,
  useGetSubscriptionOptionsQuery,
} from "features/Api/externalIntegrationsApi";
import { useLogoutMutation } from "features/Api/firebaseUserApi";
import Pricing from "features/Layout/components/Pricing/Pricing";

export default function ManageSubscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const {
    data: subscriptionOptions = [],
    isLoading: isSubscriptionOptionsLoading,
  } = useGetSubscriptionOptionsQuery();

  const [createStripeCustomerLink, createStripeCustomerLinkResult] =
    useCreateStripeCustomerLinkMutation();

  const [logout, { isSuccess: isLogoutSuccess, isLoading: isLogoutLoading }] =
    useLogoutMutation();

  const [selectedSubscription, setSelectedSubscription] = useState(
    subscriptionOptions[1],
  );

  const [alert, setAlert] = useState({
    label: "",
    caption: "",
    severity: "info",
    value: false,
  });

  const handleCreateStripeCustomerLink = () => {
    const draftStripeCustomerLink = {
      email: user?.email,
      userId: user?.uid,
      productName: selectedSubscription?.productName,
      productCost: selectedSubscription?.amount,
      productPriceId: selectedSubscription?.priceId,
      productInterval: selectedSubscription?.interval,
    };
    createStripeCustomerLink(draftStripeCustomerLink);
  };

  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    const success = params.get("success");
    if (Number(success) === 1) {
      navigate(location?.pathname, { replace: true });
      setAlert({
        label: "Refresh",
        caption: "Some transactions take couple of business days to complete.",
        severity: "warning",
        value: true,
        onClick: () => window.location.reload(),
      });
    }
  }, [location]);

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate(`/?refresh=${Date.now()}`);
    }
  }, [isLogoutLoading]);

  useEffect(() => {
    if (
      createStripeCustomerLinkResult.isSuccess &&
      !createStripeCustomerLinkResult.isLoading
    ) {
      const secureURL = createStripeCustomerLinkResult?.data?.url;
      window.open(secureURL, "_blank", "noopener,noreferrer");
      return;
    }
  }, [createStripeCustomerLinkResult.isLoading]);

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              bgcolor: "warning.light",
              color: "warning.dark",
              padding: 1,
              borderRadius: 1.5,
              display: "flex",
            }}
          >
            <PaymentRounded />
          </Box>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Manage Subscription
          </Typography>
        </Stack>
        <Box marginTop="1rem">
          {alert?.value && (
            <Alert
              severity={alert.severity}
              action={
                <AButton
                  color="inherit"
                  size="small"
                  variant="outlined"
                  onClick={alert.onClick}
                  label={alert.label}
                />
              }
            >
              <Typography variant="caption">{alert.caption}</Typography>
            </Alert>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          variant="body1"
          color="text.primary"
          sx={{ wordWrap: "break-word" }}
        >
          We were unable to process your subscription payment for&nbsp;
          <strong>{user?.email}</strong>. Please update your payment details to
          avoid any interruption to your service.
        </DialogContentText>

        <Box
          sx={{
            marginTop: 1,
            borderRadius: 2,
          }}
        >
          <Pricing
            readOnly={false}
            selectedSubscription={selectedSubscription}
            setSelectedSubscription={setSelectedSubscription}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "0rem 1rem 1rem 0rem", gap: 1 }}>
        <AButton variant="text" label="Maybe later" onClick={() => logout()} />
        <AButton
          disabled={alert?.value}
          variant="contained"
          label="Update payment method"
          loading={isSubscriptionOptionsLoading}
          onClick={handleCreateStripeCustomerLink}
        />
      </DialogActions>
    </Dialog>
  );
}
