import React, { useEffect, useState } from "react";

import { PaymentRounded } from "@mui/icons-material";
import {
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
import Pricing from "features/Layout/components/Pricing/Pricing";

export default function ManageSubscription() {
  const user = fetchLoggedInUser();

  const {
    data: subscriptionOptions = [],
    isLoading: isSubscriptionOptionsLoading,
  } = useGetSubscriptionOptionsQuery();

  const [createStripeCustomerLink, createStripeCustomerLinkResult] =
    useCreateStripeCustomerLinkMutation();

  const [selectedSubscription, setSelectedSubscription] = useState(
    subscriptionOptions[1],
  );

  const handleCreateStripeCustomerLink = () => {
    const draftStripeCustomerLink = {
      email: user?.email,
      priceId: selectedSubscription?.priceId,
    };
    createStripeCustomerLink(draftStripeCustomerLink);
  };

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
            Payment Method Expired
          </Typography>
        </Stack>
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
        <AButton
          variant="contained"
          label="Update payment method"
          loading={isSubscriptionOptionsLoading}
          onClick={handleCreateStripeCustomerLink}
        />
      </DialogActions>
    </Dialog>
  );
}
