import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArchitectureRounded,
  HomeRounded,
  ReceiptRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  EditInvoiceRouteUri,
  InvoiceDashboardRouteUri,
  PropertiesRouteUri,
  RentalRouteUri,
  ViewEsignRouteUri,
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

  const handleAuthenticate = ({ isEsign = false }) => {
    if (!user?.uid) {
      authenticate(isEsign);
    } else if (isEsign) {
      window.location.replace(ViewEsignRouteUri);
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
      const isEsign = authenticateResult.originalArgs;
      if (isEsign) {
        window.location.replace(ViewEsignRouteUri);
      } else {
        currentUserRole === Role.Tenant
          ? window.location.replace(RentalRouteUri)
          : window.location.replace(PropertiesRouteUri);
      }
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
        <Box
          sx={{
            backgroundColor: "background.default",
            padding: "0px 24px 72px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -80,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(14,124,107,.09) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ textAlign: "center", mb: 8, position: "relative" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
                px: 1.75,
                py: 0.75,
                borderRadius: "100px",
                mb: 2.5,
              }}
            >
              Property Management Platform
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 700,
                letterSpacing: "-0.015em",
                mb: 2,
                maxWidth: 660,
                mx: "auto",
                fontSize: "4rem",
              }}
            >
              Manage your rentals&nbsp;
              <Box
                component="em"
                sx={{ color: "primary.main", fontStyle: "italic" }}
              >
                effortlessly
              </Box>
              ,<br />
              all in one place
            </Typography>

            <Stack direction="column" gap={2} marginTop="1rem">
              <Typography
                textAlign="center"
                variant="body1"
                sx={{
                  color: "#999",
                  fontWeight: 400,
                }}
              >
                Login with Google and subscribe to get started.
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    padding: "0.8rem",
                    borderRadius: "0.4rem",
                    transition: "all .18s",
                  }}
                  onClick={() => handleAuthenticate({ isEsign: false })}
                >
                  See how it works
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(EditInvoiceRouteUri)}
                >
                  Build Invoice
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Divider />
        <Box marginTop={5}>
          <Stack spacing={4}>
            <Typography
              textAlign="center"
              variant="h2"
              sx={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Everything you need to run your rentals
            </Typography>
            <Typography
              variant="subtitle1"
              textAlign="center"
              sx={{
                color: "#999",
                fontWeight: 400,
                mx: "auto",
                marginBottom: 2.5,
              }}
            >
              Streamline your rental business and invoicing process with our
              integrated suite of smart tools.
            </Typography>
            <Stack
              direction={{ sm: "column", md: "row" }}
              flexWrap="wrap"
              gap={2}
            >
              <TitleCard
                title="Rent App"
                showLoginRequired
                subtitle="Manage tenants, notifications and automate payments"
                chipLabels={[
                  "Tenant Management",
                  "Auto Reminders",
                  "Payment Processing",
                ]}
                icon={
                  <HomeRounded
                    sx={{ fontSize: 32, color: "primary.main", mr: 1.5 }}
                  />
                }
                sx={{ flex: { md: 1 } }}
                onClick={() => handleAuthenticate({ isEsign: false })}
              />
              <TitleCard
                title="Invoicer App"
                subtitle="Create invoices, payments and use prepopulated templates"
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
                sx={{ flex: { md: 1 } }}
                onClick={() => navigate(InvoiceDashboardRouteUri)}
              />
              <TitleCard
                title="Esign App"
                showLoginRequired
                subtitle="Sign documents digitally with audit trails. All legally binding, secure, and instant."
                chipLabels={[
                  "Legally Binding Signatures",
                  "Secure Digital Signing",
                  "Instant Document Signing",
                ]}
                icon={
                  <ArchitectureRounded
                    sx={{ fontSize: 32, color: "primary.main", mr: 1.5 }}
                  />
                }
                sx={{ flex: { md: "100%" } }}
                onClick={() => handleAuthenticate({ isEsign: true })}
              />
            </Stack>
          </Stack>

          {/* Reviews */}
          <Stack direction="column" gap={2} marginTop="5rem">
            <Divider />
            <Typography
              textAlign="center"
              variant="h2"
              sx={{
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 600,
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
                fontWeight: 400,
              }}
            >
              Trusted by our regular users — read their reviews
            </Typography>
            <Review />
          </Stack>
        </Box>
        {/* Subscription Fees */}
        <Stack direction="column" gap={2} marginTop="5rem">
          <Typography
            textAlign="center"
            variant="h2"
            sx={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: "600",
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
              fontWeight: 400,
            }}
          >
            Simple plans designed to fit your needs — subscribe to get started
          </Typography>
          <Pricing readOnly />
        </Stack>
      </Container>
    </Box>
  );
}
