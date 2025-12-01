import React, { useState } from "react";

import { AddRounded, FiberManualRecordRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import { useGetWorkspacesMutation } from "features/Api/externalIntegrationsApi";
import UploadDocument from "features/Rent/components/UploadDocument/UploadDocument";
import ViewDocuments from "features/Rent/components/Widgets/ViewDocuments";

export default function DocumentsOverview({
  isPropertyLoading,
  property,
  dataTour,
}) {
  const theme = useTheme();
  const lteMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const [getWorkspaces, { isError, data: workspacesData = {} }] =
    useGetWorkspacesMutation();

  const [dialog, setDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const isEsignOffline = isError || !workspacesData || !selectedFile;

  const uploadDoc = () => {};

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ margin: "0rem 0rem 1rem 0rem" }}
        >
          <RowHeader
            title="Documents Overview"
            caption={`View documents assoicated with ${property?.name}`}
            sxProps={{ textAlign: "left", color: "text.secondary" }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Upload selected template for tenant to sign">
              <Box>
                {lteMedFormFactor ? (
                  <AIconButton
                    size="small"
                    variant="outlined"
                    label={<AddRounded fontSize="small" />}
                    onClick={() => setDialog(!dialog)}
                  />
                ) : (
                  <AButton
                    size="small"
                    variant="outlined"
                    onClick={() => setDialog(!dialog)}
                    label="Upload Document"
                  />
                )}
              </Box>
            </Tooltip>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          {isPropertyLoading ? <Skeleton height="5rem" /> : <ViewDocuments />}
        </Stack>
      </CardContent>

      <Dialog
        open={dialog}
        keepMounted
        fullWidth
        onClose={() => setDialog(!dialog)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Upload Pdf</DialogTitle>
        <DialogContent>
          <UploadDocument
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            getWorkspaces={getWorkspaces}
          />
        </DialogContent>
        <DialogActions>
          <Chip
            disabled={isEsignOffline}
            avatar={
              <Avatar sx={{ bgcolor: "secondary.main", width: 20, height: 20 }}>
                <FiberManualRecordRounded
                  color="primary"
                  sx={{ fontSize: 14 }}
                />
              </Avatar>
            }
            label={isEsignOffline ? "Esign Offline" : "Esign Online"}
            size="small"
            variant="outlined"
            sx={{
              color: "secondary.contrastText",
              backgroundColor: "secondary.main",
            }}
          />
          <AButton
            size="small"
            variant="outlined"
            disabled={isEsignOffline}
            onClick={uploadDoc}
            label="Upload Document"
          />
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Card>
  );
}
