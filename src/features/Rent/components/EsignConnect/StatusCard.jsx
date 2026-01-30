import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  AddLinkRounded,
  RemoveCircleOutlineRounded,
} from "@mui/icons-material";
import { Alert, Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import AIconButton from "common/AIconButton";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useUpdateUserByUidMutation } from "features/Api/firebaseUserApi";
import EsignAgreement from "features/Rent/components/EsignConnect/EsignAgreement";

export default function StatusCard({
  isEsignConnected,
  disconnectEsign,
  esignAccountWorkspaceId,
}) {
  const user = fetchLoggedInUser();

  const [updateUser, updateUserResult] = useUpdateUserByUidMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const { watch, control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      noLegalAdviceDisclaimerAgreement: false,
      noComplianceDisclaimerAgreement: false,
    },
  });

  const hasAcceptedAllAgreements =
    watch("noLegalAdviceDisclaimerAgreement") &&
    watch("noComplianceDisclaimerAgreement");

  const onSubmit = (data) => {
    const draftData = {
      ...data,
      esignAccountIsActive: true,
      esignAccountWorkspaceId: uuidv4(),
      esignDisclaimersSignedAt: dayjs().toISOString(),
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    };
    updateUser({
      uid: user?.uid,
      newData: draftData,
    });
  };

  useEffect(() => {
    if (updateUserResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [updateUserResult.isLoading]);

  return (
    <Card elevation={0} sx={{ p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <RowHeader
          title="Account Connection"
          caption="View details about your esign account."
          sxProps={{ textAlign: "left" }}
        />
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title={isEsignConnected ? "Disconnect esign" : "Link esign"}>
            <AIconButton
              size="small"
              label={
                isEsignConnected ? (
                  <RemoveCircleOutlineRounded color="error" fontSize="small" />
                ) : (
                  <AddLinkRounded color="error" fontSize="small" />
                )
              }
              onClick={disconnectEsign}
            />
          </Tooltip>
        </Box>
      </Box>
      <Box margin={0.5}>
        <Alert severity="warning">
          Landlord tenant laws may vary by city and property type. This platform
          provides document automation services, not legal services.
        </Alert>
      </Box>

      {!isEsignConnected ? (
        <EsignAgreement
          control={control}
          onSubmit={handleSubmit(onSubmit)}
          isEsignLinkDisabled={!hasAcceptedAllAgreements}
          isButtonComponentLoading={updateUserResult.isLoading}
        />
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Your Esign account is connected. Verify E-sign details.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Stack>
              <Typography variant="body2" color="textPrimary" fontWeight="bold">
                Esign Workspace ID:
              </Typography>
              <Typography variant="body2" color="error">
                {esignAccountWorkspaceId}
              </Typography>
            </Stack>

            <Stack>
              <Typography variant="body2" color="textPrimary" fontWeight="bold">
                Status
              </Typography>
              <Typography variant="body2" color="info">
                Online
              </Typography>
            </Stack>
          </Stack>
        </>
      )}
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Card>
  );
}
