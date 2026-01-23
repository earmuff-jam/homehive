import React, { useState } from "react";

import { useSearchParams } from "react-router-dom";

import dayjs from "dayjs";

import {
  ConnectWithoutContactRounded,
  EmailRounded,
  PersonRounded,
} from "@mui/icons-material";
import {
  Card,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RowHeader from "common/RowHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import ExternalIntegrations from "features/Rent/components/ExternalIntegrations/ExternalIntegrations";
import ProfileDetails from "features/Rent/components/ProfileDetails/ProfileDetails";
import { TabPanel } from "features/Rent/components/Settings/common";
import Templates from "features/Rent/components/Templates/Templates";
import { useAppTitle } from "hooks/useAppTitle";

dayjs.extend(relativeTime);

export default function Settings() {
  useAppTitle("View Settings");

  const theme = useTheme();
  const [searchParams] = useSearchParams();

  const currentTab = Number(searchParams.get("tabIdx")) || 0;
  const smallFormFactor = useMediaQuery(theme.breakpoints.down("sm"));

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
          <ProfileDetails />
        </TabPanel>
      ),
    },
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
      label: "External Integrations",
      icon: <ConnectWithoutContactRounded fontSize="small" />,
      content: (
        <TabPanel value={activeTab} index={2}>
          <ExternalIntegrations />
        </TabPanel>
      ),
    },
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
              label={
                !smallFormFactor && (
                  <Typography variant="subtitle2">{label}</Typography>
                )
              }
              icon={icon}
              iconPosition="start"
              data-tour={`settings-${idx + 1}`}
            />
          ))}
        </Tabs>
      </Card>

      {tabConfig.map((tab, idx) => (
        <React.Fragment key={idx}>{tab.content}</React.Fragment>
      ))}
    </Stack>
  );
}
