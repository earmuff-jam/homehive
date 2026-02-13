import React from "react";

import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";

const PricingPlans = [
  {
    id: 1,
    title: "Monthly Plan",
    price: "$5",
    interval: "/month",
    description:
      "Limited to 2 properties. Most common for regular users. Billed monthly.",
  },
  {
    id: 2,
    title: "Yearly Plan",
    price: "$50",
    interval: "/year",
    description:
      "Unlimited properties and tenants. Most common for commercial purposes. Billed yearly.",
  },
];

export default function Pricing() {
  return (
    <Stack spacing={3}>
      <Stack direction={{ md: "row", xs: "column" }} spacing={1} useFlexGap>
        {PricingPlans.map((plan) => (
          <Card
            key={plan.id}
            sx={{
              borderRadius: "1rem",
              flex: 1,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  {plan.title}
                </Typography>

                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                  <Typography variant="h4" fontWeight={700}>
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.interval}
                  </Typography>
                </Stack>

                <Divider />

                <Typography variant="body2" color="text.secondary">
                  {plan.description}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
