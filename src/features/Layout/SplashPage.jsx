import React from "react";

import { HomeRounded, ReceiptRounded } from "@mui/icons-material";
import { Box, Container, Stack, Typography } from "@mui/material";
import TitleCard from "features/Layout/components/TitleCard/TitleCard";
import { useAppTitle } from "hooks/useAppTitle";

export default function SplashPage() {
  useAppTitle("Home");
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

        <Stack sx={{ direction: { sm: "column", md: "row" } }} spacing={2}>
          <TitleCard
            title="Rental App"
            subtitle="Manage properties, tenants, leases, and payments in one place"
            chipLabels={[
              "Property Management",
              "Tenant Tracking",
              "Lease Agreements",
              "Payment Processing",
            ]}
            icon={
              <HomeRounded
                sx={{ fontSize: 32, color: "primary.main", mr: 1.5 }}
              />
            }
          />
          <TitleCard
            title="Invoicer App"
            subtitle="Create and track professional invoices with automated reminders"
            chipLabels={[
              "Invoice Creation",
              "Payment Tracking",
              "Auto Reminders",
              "Professional Templates",
            ]}
            icon={
              <ReceiptRounded
                sx={{ fontSize: 32, color: "secondary.main", mr: 1.5 }}
              />
            }
          />
        </Stack>
      </Container>
    </Box>
  );
}
