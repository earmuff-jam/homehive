import React from "react";

import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
} from "@mui/material";
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
              color: "#333",
              mb: 1,
            }}
          >
            Property management made simple
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              mb: 4,
            }}
          >
            EarmuffJam LLC
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

        <Box sx={{ mb: 8 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e0e0e0",
              mb: 3,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <HomeIcon sx={{ fontSize: 32, color: "#1976d2", mr: 1.5 }} />
                <Typography variant="h4" sx={{ fontWeight: 400 }}>
                  Rental App
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                Manage properties, tenants, leases, and payments in one place
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip label="Property Management" size="small" />
                <Chip label="Tenant Tracking" size="small" />
                <Chip label="Lease Agreements" size="small" />
                <Chip label="Payment Processing" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #e0e0e0",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <ReceiptIcon sx={{ fontSize: 32, color: "#2e7d32", mr: 1.5 }} />
                <Typography variant="h4" sx={{ fontWeight: 400 }}>
                  Invoicer App
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                Create and track professional invoices with automated reminders
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip label="Invoice Creation" size="small" />
                <Chip label="Payment Tracking" size="small" />
                <Chip label="Auto Reminders" size="small" />
                <Chip label="Professional Templates" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
