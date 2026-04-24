import React, { useEffect } from "react";

import { CheckCircleOutlineRounded } from "@mui/icons-material";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGetSubscriptionOptionsQuery } from "features/Api/externalIntegrationsApi";
import { formatCurrency } from "features/Rent/utils";

export default function Pricing({
  handleRentClick,
  selectedSubscription,
  setSelectedSubscription,
  readOnly = false,
}) {
  const theme = useTheme();
  const smScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up("md"));

  const {
    data: subscriptionOptions = [],
    isLoading: isSubscriptionOptionsLoading,
    isSuccess: isSubscriptionOptionsSuccess,
  } = useGetSubscriptionOptionsQuery();

  const handleClick = (id) => {
    if (readOnly) return;
    const selectedSubscription = subscriptionOptions?.find(
      (option) => option.priceId === id,
    );
    setSelectedSubscription(selectedSubscription);
  };

  const sortedSubscriptionOptions = subscriptionOptions
    ?.slice()
    .sort((a, b) => a.amount - b.amount)
    .map((option) => ({
      ...option,
      title: option?.productName?.replace(/Monthly/i, "").trim(),
    }));

  useEffect(() => {
    if (readOnly) return;
    if (!isSubscriptionOptionsLoading && isSubscriptionOptionsSuccess) {
      // sets monthly plan as default
      setSelectedSubscription({ ...subscriptionOptions[1] });
    }
  }, [
    isSubscriptionOptionsLoading,
    isSubscriptionOptionsSuccess,
    subscriptionOptions,
    readOnly,
  ]);

  if (isSubscriptionOptionsLoading) return <Skeleton height="5rem" />;

  return (
    <Stack spacing={3}>
      <Stack direction={{ md: "row", xs: "column" }} spacing={3} useFlexGap>
        {sortedSubscriptionOptions.map((plan) => {
          const isPopular = plan.productName === "Monthly Professional Plan";
          return (
            <Card
              key={plan.productId}
              sx={{
                width: smScreenSizeAndHigher ? "30rem" : "inherit",
                cursor: !readOnly ? "pointer" : "default",
                height: "20rem",
                display: "flex",
                flexDirection: "column",
                border: isPopular ? "0.1rem solid" : null,
                borderColor: isPopular ? "primary.main" : null,
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                ...(isPopular && {
                  border: "1px solid",
                  borderColor: "primary.main",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.25)",
                }),
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 28px rgba(25, 118, 210, 0.35)",
                },
              }}
            >
              <CardContent
                onClick={() => handleClick(plan.priceId)}
                sx={{ flexGrow: 1 }}
              >
                <Badge
                  badgeContent={
                    plan.productId === selectedSubscription?.productId && (
                      <CheckCircleOutlineRounded color="success" />
                    )
                  }
                >
                  <Stack spacing={1} padding={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {plan?.title}
                    </Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                      <Typography variant="h1" fontWeight={300}>
                        ${formatCurrency(plan?.amount / 100)}
                      </Typography>
                      <Typography variant="caption" color="primary.main">
                        /{plan?.interval}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Typography variant="body2" color="text.secondary">
                      {plan?.description}
                    </Typography>
                  </Stack>
                </Badge>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                <Button
                  onClick={handleRentClick}
                  variant={isPopular ? "contained" : "outlined"}
                  sx={{
                    padding: "0.8rem",
                    borderRadius: "0.4rem",
                    transition: "all .18s",
                  }}
                >
                  Get Started
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
}
