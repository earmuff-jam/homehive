import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArchitectureRounded,
  ArrowForward,
  HomeRounded,
  ReceiptRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
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
import { useReveal } from "features/Layout/useReveal";
import { useAppTitle } from "hooks/useAppTitle";

export default function SplashPage() {
  useAppTitle("Home");
  const navigate = useNavigate();
  const user = fetchLoggedInUser();
  const { ref, visible } = useReveal();

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
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            position: "relative",
            pb: { xs: 6, md: 10 },
            overflow: "hidden",
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Instrument Serif', serif",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  textAlign: "center",
                  fontSize: { xs: "2.75rem", sm: "3.5rem", md: "4rem" },
                  mb: 3,
                }}
              >
                Manage your rentals{" "}
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    fontStyle: "italic",
                    position: "relative",
                    textAlign: "center",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: 0,
                      width: "100%",
                      height: "8px",
                      bgcolor: "rgba(14,124,107,0.15)",
                      borderRadius: "4px",
                      zIndex: -1,
                    },
                  }}
                >
                  effortlessly
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#999",
                  fontWeight: 400,
                  fontSize: "1.125rem",
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Streamline tenants, invoices, and e-signatures in one unified
                workspace. Built for landlords who value their time.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => handleAuthenticate({ isEsign: false })}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(14,124,107,0.25)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 20px rgba(14,124,107,0.35)",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(EditInvoiceRouteUri)}
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textTransform: "none",
                    borderWidth: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      borderWidth: 1.5,
                    },
                  }}
                >
                  Build Invoice
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 320, sm: 420, md: 480 },
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px -12px rgba(0,0,0,0.15)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80"
                  alt="Modern rental property"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                />
                {/* Subtle gradient overlay at bottom */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                    pointerEvents: "none",
                  }}
                />
                {/* Floating mini-card */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <HomeRounded sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      Homehive Solutions
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      Everything about your property — in one view
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
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
                title="RentX"
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
                title="InvoiceX"
                subtitle="Create and send invoices, payments or templates"
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
                title="EsignX"
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
          <Divider />
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
          <Pricing
            handleRentClick={() => handleAuthenticate({ isEsign: false })}
            readOnly
          />
        </Stack>
      </Container>
    </Box>
  );
}
