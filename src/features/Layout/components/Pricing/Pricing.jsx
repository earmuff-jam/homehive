import React, { useEffect } from "react";

import { CheckCircleOutlineRounded } from "@mui/icons-material";
import {
  Badge,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useGetSubscriptionOptionsQuery } from "features/Api/externalIntegrationsApi";
import { formatCurrency } from "features/Rent/utils";

export default function Pricing({
  selectedSubscription,
  setSelectedSubscription,
  readOnly = false, // prevent click action
}) {
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

  useEffect(() => {
    if (readOnly) return;
    if (!isSubscriptionOptionsLoading && isSubscriptionOptionsSuccess) {
      // sets monthly plan as default
      setSelectedSubscription(subscriptionOptions[1]);
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
      <Stack direction={{ md: "row", xs: "column" }} spacing={1} useFlexGap>
        {subscriptionOptions.map((plan) => (
          <Card
            key={plan.productId}
            sx={{
              cursor: "pointer",
              border:
                plan.productId === selectedSubscription?.productId
                  ? "2px solid"
                  : "1px solid",
              borderColor:
                plan.productId === selectedSubscription?.productId
                  ? "primary.main"
                  : "grey.300",
              backgroundColor:
                plan.productId === selectedSubscription?.productId
                  ? "action.selected"
                  : "background.paper",
            }}
          >
            <CardContent onClick={() => handleClick(plan.priceId)}>
              <Badge
                badgeContent={
                  plan.productId === selectedSubscription?.productId && (
                    <CheckCircleOutlineRounded color="success" />
                  )
                }
              >
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {plan?.productName}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>
                      ${formatCurrency(plan?.amount / 100)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
