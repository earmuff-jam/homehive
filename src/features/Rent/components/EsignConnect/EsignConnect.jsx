import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import {
  HelpOutlineRounded,
  SecurityRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import { Grid2, Skeleton } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import RecentDocuments from "features/Rent/components/EsignConnect/RecentDocuments";
import StatusCard from "features/Rent/components/EsignConnect/StatusCard";
import HelpAndSupport from "features/Rent/components/ExternalIntegrations/HelpAndSupport";

const EsignConnectOptions = [
  {
    id: 1,
    title: "Usage guide",
    caption: "Instructions for using Esign",
    icon: (
      <HelpOutlineRounded sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
    ),
    buttonText: "How it works",
    to: "https://goodsign.io/blog/How-GoodSign-Simplifies-Your-Workflow",
  },
  {
    id: 2,
    title: "Contact Support",
    caption: "Contact Esign support",
    icon: (
      <SupportAgentRounded
        sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
      />
    ),
    buttonText: "Contact us via Esign chart support",
    to: "https://crisp.chat/en/",
  },
  {
    id: 3,
    title: "Security & Compliance",
    caption: "Learn about Esign compliance",
    icon: (
      <SecurityRounded sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
    ),
    buttonText: "View Compliance",
    to: "https://goodsign.io/security",
  },
];

export default function EsignConnect() {
  const user = fetchLoggedInUser();

  const { data: userData, isLoading: isUserDataFromDbLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const [updateUser, updateUserResult] = useUpdateUserByUidMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const isEsignConnected = userData?.esignAccountIsActive;

  const updateUsr = (data) => {
    updateUser({
      uid: userData?.uid,
      newData: {
        ...data,
      },
    });
  };

  const disconnectEsign = () =>
    updateUsr({
      esignAccountIsActive: false,
      updatedOn: dayjs().toISOString(),
      updatedBy: user?.uid,
    });

  useEffect(() => {
    if (updateUserResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [updateUserResult.isLoading]);

  if (isUserDataFromDbLoading) return <Skeleton height="10rem" width="100%" />;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <StatusCard
          disconnectEsign={disconnectEsign}
          isEsignConnected={isEsignConnected}
          esignAccountWorkspaceId={userData?.esignAccountWorkspaceId}
        />
      </Grid2>

      <Grid2 size={12}>
        <RecentDocuments />
      </Grid2>

      <Grid2 size={12}>
        <HelpAndSupport options={EsignConnectOptions} />
      </Grid2>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Grid2>
  );
}
