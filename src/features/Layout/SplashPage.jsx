import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { HomeRounded, ReceiptRounded } from "@mui/icons-material";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import {
  InvoiceDashboardRouteUri,
  OwnerRole,
  PropertiesRouteUri,
} from "common/utils";
import { useAuthenticateMutation } from "features/Api/firebaseUserApi";
import TitleCard from "features/Layout/components/TitleCard/TitleCard";
import { useAppTitle } from "hooks/useAppTitle";

export default function SplashPage() {
  useAppTitle("Home");
  const navigate = useNavigate();

  const [
    authenticate,
    {
      isSuccess: isAuthSuccess,
      isLoading: isAuthLoading,
      isError: isAuthError,
      error: authError,
    },
  ] = useAuthenticateMutation();

  const handleAuth = () => {
    authenticate(OwnerRole);
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthSuccess) {
      window.location.replace(PropertiesRouteUri);
    }
  }, [isAuthLoading]);

  if (isAuthError) {
    return (
      <Alert severity="error">
        <Stack>
          <Typography>Error during log in. Please try again later.</Typography>
          <Typography variant="caption">{authError?.message}</Typography>
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
            title="Rental App"
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
            onClick={handleAuth}
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
      </Container>
    </Box>
  );
}
