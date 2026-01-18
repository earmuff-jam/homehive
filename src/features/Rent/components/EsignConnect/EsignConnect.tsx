import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { Grid2, Skeleton } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import { useCreateWorkspaceMutation } from "features/Api/externalIntegrationsApi";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import HelpAndSupport from "features/Rent/common/HelpAndSupport";
import RecentDocuments from "features/Rent/components/EsignConnect/RecentDocuments";
import StatusCard from "features/Rent/components/EsignConnect/StatusCard";
import { EsignConnectOptions } from "features/Rent/components/EsignConnect/constants";
import { TUser } from "src/types";

export default function EsignConnect() {
  const user: TUser = fetchLoggedInUser();

  const { data: userData, isLoading: isUserDataFromDbLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const [triggerUpdateUser, updateUserResult] = useUpdateUserByUidMutation();
  const [triggerCreateWorkspace, createWorkspaceResult] =
    useCreateWorkspaceMutation();

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const isEsignConnected = userData?.eSignAccountIsActive;

  const updateEsignAccountForUser = (data) => {
    triggerUpdateUser({
      uid: userData?.uid,
      newData: {
        ...data,
      },
    });
  };

  // fetch unique workspaceID only if none exists
  const connectEsign = () => {
    if (!userData?.esignAccountWorkspaceId) {
      triggerCreateWorkspace({ workspaceId: uuidv4() });
    } else {
      updateEsignAccountForUser({
        esignAccountIsActive: true,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid,
      });
    }
  };

  const disconnectEsign = () =>
    updateEsignAccountForUser({
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
      updateEsignAccountForUser({
        esignAccountIsActive: true,
        esignAccountWorkspaceId: createWorkspaceResult.originalArgs.workspaceId,
        esignAccountWorkspaceName: createWorkspaceResult.data.name,
        esignAccountWorkspaceCreatedAt: createWorkspaceResult.data.createdAt,
        updatedBy: user?.uid,
        updatedOn: dayjs(),
      });
    }
  }, [createWorkspaceResult.isLoading]);

  if (isUserDataFromDbLoading) return <Skeleton height="10rem" width="100%" />;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <StatusCard
          connectEsign={connectEsign}
          isUpdateUserLoading={updateUserResult.isLoading}
          handleClick={isEsignConnected ? disconnectEsign : connectEsign}
          isEsignConnected={isEsignConnected}
          esignAccountWorkspaceId={userData?.esignAccountWorkspaceId}
        />
      </Grid2>

      <Grid2 size={12}>
        <RecentDocuments documents={[]} loading={false} />
      </Grid2>

      <Grid2 size={12}>
        <HelpAndSupport options={EsignConnectOptions} />
      </Grid2>

      <CustomSnackbar
        severity="success"
        title="Changes saved."
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
      />
    </Grid2>
  );
}
