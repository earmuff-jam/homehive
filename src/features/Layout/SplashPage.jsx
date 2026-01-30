import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { HomeRounded, ReceiptRounded } from "@mui/icons-material";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import {
  InvoiceDashboardRouteUri,
  PropertiesRouteUri,
  RentalRouteUri,
  fetchLoggedInUser,
} from "common/utils";
import { useAuthenticateMutation } from "features/Api/firebaseUserApi";
import { Role } from "features/Auth/AuthHelper";
import Pricing from "features/Layout/components/Pricing/Pricing";
import Review from "features/Layout/components/Review/Review";
import TitleCard from "features/Layout/components/TitleCard/TitleCard";
import { useAppTitle } from "hooks/useAppTitle";

export default function SplashPage() {
  useAppTitle("Home");
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const [authenticate, authenticateResult] = useAuthenticateMutation();

  const handleAuthenticate = () => {
    if (!user?.uid) {
      authenticate();
    } else {
      const currentUserRole = user?.role;
      currentUserRole === Role.Tenant
        ? window.location.replace(RentalRouteUri)
        : window.location.replace(PropertiesRouteUri);
    }
  };

  useEffect(() => {
    if (!authenticateResult.isLoading && authenticateResult.isSuccess) {
      const currentUserRole = authenticateResult.data.role;
      currentUserRole === Role.Tenant
        ? window.location.replace(RentalRouteUri)
        : window.location.replace(PropertiesRouteUri);
    }
  }, [authenticateResult.isLoading]);

  if (authenticateResult.isError) {
    return (
      <Alert severity="error">
        <Stack>
          <Typography>Error during log in. Please try again later.</Typography>
          <Typography variant="caption">
            {authenticateResult.error?.message}
          </Typography>
        </Stack>
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 300,
              mb: 1,
            }}
          >
            Property management made simple
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              fontWeight: 300,
              mb: 2,
            }}
          ></Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
              fontWeight: 300,
            }}
          >
            Streamline your rental business and invoicing process with our
            integrated suite
          </Typography>
        </Box>

        <Stack direction={{ sm: "column", md: "row" }} gap={2}>
          <TitleCard
            title="Rent App"
            subtitle="Manage tenants, leases, and payments"
            chipLabels={[
              "Tenant Management",
              "Lease Agreements",
              "Auto Reminders",
              "Payment Processing",
            ]}
            icon={
              <HomeRounded
                sx={{ fontSize: 32, color: "primary.main", mr: 1.5 }}
              />
            }
            onClick={handleAuthenticate}
          />
          <TitleCard
            title="Invoicer App"
            subtitle="Create and track professional invoices"
            chipLabels={[
              "Invoice Creation",
              "Payment Tracking",
              "Professional Templates",
            ]}
            icon={
              <ReceiptRounded
                sx={{ fontSize: 32, color: "secondary.main", mr: 1.5 }}
              />
            }
            onClick={() => navigate(InvoiceDashboardRouteUri)}
          />
        </Stack>
        {/* Reviews */}
        <Stack direction="column" gap={2} marginTop="5rem">
          <Typography
            textAlign="center"
            variant="h2"
            sx={{
              fontWeight: 300,
              mb: 1,
            }}
          >
            See what our users have to say
          </Typography>

          <Typography
            textAlign="center"
            variant="body1"
            sx={{
              color: "#999",
              fontWeight: 300,
            }}
          >
            Trusted by our regular users — read their reviews
          </Typography>
          <Review />
        </Stack>
        {/* Subscription Fees */}
        <Stack direction="column" gap={2} marginTop="5rem">
          <Typography
            textAlign="center"
            variant="h2"
            sx={{
              fontWeight: 300,
              mb: 1,
            }}
          >
            Subscription and Fees
          </Typography>

          <Typography
            textAlign="center"
            variant="body1"
            sx={{
              color: "#999",
              fontWeight: 300,
            }}
          >
            Simple plans designed to fit your needs — subscribe to get started
          </Typography>
          <Pricing />
        </Stack>
        {/* Subscription Fees */}
        <Stack direction="column" gap={2} marginTop="1rem">
          <Typography
            textAlign="center"
            variant="body1"
            sx={{
              color: "#999",
              fontWeight: 300,
            }}
          >
            Login with Google and subscribe to get started.
          </Typography>
          <AButton
            label="Login with Google"
            variant="outlined"
            onClick={handleAuthenticate}
          />
        </Stack>
      </Container>
    </Box>
  );
}
