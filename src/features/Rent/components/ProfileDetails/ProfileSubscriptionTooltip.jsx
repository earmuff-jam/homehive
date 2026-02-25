import React from "react";

import dayjs from "dayjs";

import { DateRangeRounded, Payment } from "@mui/icons-material";
import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";

export const ProfileSubscriptionTooltip = ({ data, isLoading }) => {
  const capitalizedSubscriptionStatus =
    data?.subscriptionStatus?.charAt(0).toUpperCase() +
    data?.subscriptionStatus?.substring(1);

  if (isLoading) return <Skeleton />;
  return (
    <Stack
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        padding: 1,
      }}
    >
      {data?.subscriptionStatus === "paid" ? (
        <Stack>
          <Typography variant="caption" fontWeight="bold">
            Subscription details
          </Typography>
          <Divider />
          <Stack sx={{ paddingTop: 0.5 }}>
            <Stack direction="row" gap={1} alignItems="center">
              <Payment fontSize="small" color="success" />
              <Typography variant="caption">
                <Box component="span" fontWeight="bold">
                  Status:&nbsp;
                </Box>
                {capitalizedSubscriptionStatus}
              </Typography>
            </Stack>
            <Stack direction="row" gap={1} alignItems="center">
              <DateRangeRounded fontSize="small" color="success" />
              <Typography variant="caption">
                <Box component="span" fontWeight="bold">
                  Paid On:&nbsp;
                </Box>
                {dayjs(data?.updatedOn).format("DD-MM-YYYY")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Payment fontSize="small" color="warning" />
      )}
    </Stack>
  );
};
