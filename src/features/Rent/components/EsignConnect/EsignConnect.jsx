import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  HelpOutlineRounded,
  SecurityRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import { Grid2, Skeleton } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import { useCreateWorkspaceMutation } from "features/Api/externalIntegrationsApi";
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
    to: "https://firma.dev/insights",
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
    buttonText: "Contact us",
    to: "https://firma.dev/contact",
  },
  {
    id: 3,
    title: "Security & Compliance",
    caption: "Learn about Esign compliance",
    icon: (
      <SecurityRounded sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
    ),
    buttonText: "View Compliance",
    to: "https://firma.dev/insights/how-to-keep-your-e-signatures-secure-without-adding-complexity",
  },
];

export default function EsignConnect() {
  const user = fetchLoggedInUser();

  const { data: userData, isLoading: isUserDataFromDbLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const [updateUser, updateUserResult] = useUpdateUserByUidMutation();
  const [createWorkspace, createWorkspaceResult] = useCreateWorkspaceMutation();

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

  // fetch unique workspaceID only if none exists
  const connectEsign = () => {
    if (!userData?.esignAccountWorkspaceId) {
      createWorkspace({ workspaceId: uuidv4() });
    } else {
      updateUsr({
        esignAccountIsActive: true,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid,
      });
    }
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

  useEffect(() => {
    if (createWorkspaceResult.isSuccess) {
      const data = createWorkspaceResult?.data;
      const workspaceId = createWorkspaceResult.originalArgs.workspaceId;
      updateUsr({
        esignAccountIsActive: true,
        esignAccountWorkspaceId: workspaceId,
        esignAccountWorkspaceName: data?.name,
        esignAccountWorkspaceCreatedAt: data?.createdAt,
        updatedBy: user?.uid,
        updatedOn: dayjs().toISOString(),
      });
    }
  }, [createWorkspaceResult.isLoading]);

  if (isUserDataFromDbLoading) return <Skeleton height="10rem" width="100%" />;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <StatusCard
          connectEsign={connectEsign}
          isUpdateUserLoading={isUpdateUserLoading}
          handleClick={isEsignConnected ? disconnectEsign : connectEsign}
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
