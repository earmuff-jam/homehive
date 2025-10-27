import React, { useState } from "react";

import { useSearchParams } from "react-router-dom";

import dayjs from "dayjs";

import {
  EmailRounded,
  PaymentRounded,
  PersonRounded,
} from "@mui/icons-material";
import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";
import RowHeader from "common/RowHeader/RowHeader";
import { OwnerRole } from "common/utils";
import relativeTime from "dayjs/plugin/relativeTime";
import { Profile } from "features/Rent/components/Profile/Profile";
import { TabPanel } from "features/Rent/components/Settings/common";
import StripeConnect from "features/Rent/components/StripeConnect/StripeConnect";
import Templates from "features/Rent/components/Templates/Templates";
import { fetchLoggedInUser } from "features/Rent/utils/utils";
import { useAppTitle } from "hooks/useAppTitle";

dayjs.extend(relativeTime);

export default function Settings() {
  useAppTitle("View Settings");

  const user = fetchLoggedInUser();
  const [searchParams] = useSearchParams();

  const currentTab = Number(searchParams.get("tabIdx")) || 0;
  const isPropertyOwner = user?.role === OwnerRole;

  const [activeTab, setActiveTab] = useState(currentTab);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const tabConfig = [
    {
      label: "Profile",
      icon: <PersonRounded fontSize="small" />,
      content: (
        <TabPanel value={activeTab} index={0}>
          <Profile />
        </TabPanel>
      ),
    },
    ...(isPropertyOwner
      ? [
          {
            label: "Templates",
            icon: <EmailRounded fontSize="small" />,
            content: (
              <TabPanel value={activeTab} index={1}>
                <Templates />
              </TabPanel>
            ),
          },
          {
            label: "Manage Payments",
            icon: <PaymentRounded fontSize="small" />,
            content: (
              <TabPanel value={activeTab} index={2}>
                <StripeConnect />
              </TabPanel>
            ),
          },
        ]
      : []),
  ];

  return (
    <Stack spacing={1} data-tour={"settings-0"}>
      <RowHeader
        title="Account Settings"
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
        caption="Manage your profile data, preferences, and communication templates."
      />

      <Card elevation={0}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              minHeight: 64,
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        >
          {tabConfig.map(({ label, icon }, idx) => (
            <Tab
              key={label}
              label={<Typography variant="subtitle2">{label}</Typography>}
              icon={icon}
              iconPosition="start"
              data-tour={`settings-${idx + 1}`}
            />
          ))}
        </Tabs>
      </Card>

      {tabConfig.map((tab, idx) => (
        <Box key={idx}>{tab.content}</Box>
      ))}
    </Stack>
  );
}
