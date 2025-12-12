import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  HelpOutlineRounded,
  SecurityRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import { Grid2, Skeleton } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { useCreateWorkspaceMutation } from "features/Api/externalIntegrationsApi";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import RecentDocuments from "features/Rent/components/EsignConnect/RecentDocuments";
import StatusCard from "features/Rent/components/EsignConnect/StatusCard";
import HelpAndSupport from "features/Rent/components/ExternalIntegrations/HelpAndSupport";
import { fetchLoggedInUser } from "features/Rent/utils";

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

  const [
    updateUser,
    { isLoading: isUpdateUserLoading, isSuccess: isUpdateUserSuccess },
  ] = useUpdateUserByUidMutation();

  const [
    createWorkspace,
    {
      originalArgs,
      isLoading: isCreateWorkspaceLoading,
      isSuccess: isCreateWorkspaceSuccess,
      data: createWorkspaceRespData,
    },
  ] = useCreateWorkspaceMutation();

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
    if (isUpdateUserSuccess) {
      setShowSnackbar(true);
    }
  }, [isUpdateUserLoading]);

  useEffect(() => {
    if (isCreateWorkspaceSuccess) {
      updateUsr({
        esignAccountIsActive: true,
        esignAccountWorkspaceId: originalArgs.workspaceId,
        esignAccountWorkspaceName: createWorkspaceRespData?.name,
        esignAccountWorkspaceCreatedAt: createWorkspaceRespData?.createdAt,
        updatedBy: user?.uid,
        updatedOn: dayjs().toISOString(),
      });
    }
  }, [isCreateWorkspaceLoading]);

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
