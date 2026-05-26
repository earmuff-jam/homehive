import React from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import RowHeader from "common/RowHeader";

const paymentPlans = [
  {
    title: "Standard",
    description:
      "Access a complete payments platform with simple, pay-as-you-go pricing. No setup fees, monthly fees, or hidden fees.",
    price: "2.9% + 30¢",
    subText: "per successful transaction (domestic)",
  },
  {
    title: "Bank Transfer",
    description:
      "Lower cost option for ACH payments with slower settlement times.",
    price: "0.8%",
    subText: "per successful transaction (capped at $5)",
  },
];

const PaymentPricingInfo = () => {
  return (
    <Grid size={{ xs: 12 }}>
      <Card
        variant="outlined"
        sx={(theme) => ({
          padding: 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        })}
      >
        <RowHeader
          title="Stripe Payments and Fees"
          caption="View details about the payment and fees"
          sxProps={{
            fontSize: "0.875rem",
            fontWeight: "bold",
            textAlign: "left",
          }}
        />
        <Box sx={{ margin: 1 }}>
          <Alert severity="error" variant="outlined">
            <Typography variant="caption">
              Property owners are required to maintain their own Stripe Account
              for tax and compliance purposes.
            </Typography>
          </Alert>
        </Box>
        {paymentPlans.map((plan, index) => (
          <CardContent key={plan.title} sx={{ padding: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {plan.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {plan.description}
              </Typography>

              <Box
                sx={(theme) => ({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : theme.palette.grey[100],
                })}
              >
                <Typography variant="h6" fontWeight={700}>
                  {plan.price}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {plan.subText}
                </Typography>
              </Box>
            </Stack>

            {index !== paymentPlans.length - 1 && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={(theme) => ({
                    height: 1,
                    bgcolor: theme.palette.divider,
                  })}
                />
              </Box>
            )}
          </CardContent>
        ))}
      </Card>
    </Grid>
  );
};

export default PaymentPricingInfo;
