import React from "react";

import {
  AddLinkRounded,
  CloudCircleRounded,
  RemoveCircleOutlineRounded,
} from "@mui/icons-material";
import { Alert, Box, Card, Stack, Tooltip, Typography } from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import RowHeader from "common/RowHeader";

export default function StatusCard({
  isEsignConnected,
  handleClick,
  connectEsign,
  isUpdateUserLoading,
  esignAccountWorkspaceId,
}) {
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
              onClick={handleClick}
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
    </Card>
  );
}
