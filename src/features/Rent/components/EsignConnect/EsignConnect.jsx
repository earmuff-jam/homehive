import React from "react";

import dayjs from "dayjs";

import {
  AddLinkRounded,
  CloudCircleRounded,
  EjectRounded,
  HelpOutlineRounded,
  SecurityRounded,
  SupportAgentRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  Grid2,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import RowHeader from "common/RowHeader/RowHeader";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import RecentDocuments from "features/Rent/components/EsignConnect/RecentDocuments";
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

  const [updateUser, { isLoading: isUpdateUserLoading }] =
    useUpdateUserByUidMutation();

  const isEsignConnected = userData?.esignAccountIsActive;

  const connectEsign = () => {
    updateUser({
      uid: userData?.uid,
      newData: {
        esignAccountIsActive: true,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid,
      },
    });
  };

  const disconnectEsign = () => {
    updateUser({
      uid: userData?.uid,
      newData: {
        esignAccountIsActive: false, // used to link / unlink account
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid,
      },
    });
  };

  if (isUserDataFromDbLoading) return <Skeleton height="10rem" width="100%" />;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        {/* Esign Status Card goes here*/}
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
              <Tooltip
                title={isEsignConnected ? "Disconnect esign" : "Link esign"}
              >
                <AIconButton
                  size="small"
                  disabled
                  label={
                    isEsignConnected ? (
                      <EjectRounded color="error" fontSize="small" />
                    ) : (
                      <AddLinkRounded color="error" fontSize="small" />
                    )
                  }
                  onClick={isEsignConnected ? disconnectEsign : connectEsign}
                />
              </Tooltip>
            </Box>
          </Box>
          <Alert severity={!isEsignConnected ? "info" : "success"}>
            Link with our provider esign account for easy access for signed
            documents.
          </Alert>

          {!isEsignConnected ? (
            <AButton
              disabled
              sx={{ mt: 2 }}
              startIcon={<CloudCircleRounded fontSize="small" />}
              label="Link Esign"
              variant="contained"
              onClick={connectEsign}
              loading={isUpdateUserLoading}
            />
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your docusign account is connected. Verify docusign details.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Stack>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Docusign ID:
                  </Typography>
                  <Typography variant="body2" color="error">
                    {userData?.esignAccountId}
                  </Typography>
                </Stack>

                <Stack>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    fontWeight="bold"
                  >
                    Status
                  </Typography>
                  <Typography variant="body2" color="info">
                    {userData?.esignAccountType}
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}
        </Card>
      </Grid2>

      <Grid2 size={12}>
        {/* Esign Account Information */}
        <Card elevation={0} sx={{ p: 1, height: "100%" }}>
          <RowHeader
            title="Esign Account Information"
            caption="View details about your connected account."
            sxProps={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              textAlign: "left",
            }}
          />
        </Card>
      </Grid2>

      <Grid2 size={12}>
        <RecentDocuments />
      </Grid2>

      <Grid2 size={12}>
        <HelpAndSupport options={EsignConnectOptions} />
      </Grid2>
    </Grid2>
  );
}
