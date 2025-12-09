import React, { useEffect, useState } from "react";

import { AddRounded, FiberManualRecordRounded } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Card,
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
import {
  useCreateEsignFromTemplateMutation,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useGetEsignTemplatesQuery,
} from "features/Api/externalIntegrationsApi";
import EsignTemplateDetails from "features/Rent/components/EsignConnect/EsignTemplateDetails";
import UploadDocument from "features/Rent/components/UploadDocument/UploadDocument";
import {
  convertFileToBase64Encoding,
  fetchLoggedInUser,
} from "features/Rent/utils";

export default function EsignTemplates({ isEsignConnected }) {
  const theme = useTheme();
  const user = fetchLoggedInUser();
  const medFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const { data: esignTemplates, isLoading: isGetEsignTemplatesLoading } =
    useGetEsignTemplatesQuery(user?.uid, {
      skip: !isEsignConnected,
    });

  const [
    createTemplate,
    { isLoading: isCreateTemplateLoading, isSuccess: isCreateTemplateSuccess },
  ] = useCreateTemplateMutation();

  const [
    createEsignFromTemplate,
    {
      data: createdEsignDocumentFromTemplate,
      isLoading: isCreateEsignFromTemplateLoading,
      isSuccess: isCreateEsignFromTemplateSuccess,
    },
  ] = useCreateEsignFromTemplateMutation();

  console.log(createdEsignDocumentFromTemplate);

  const [
    deleteRow,
    { isLoading: isDeleteRowLoading, isSuccess: isDeleteRowSuccess },
  ] = useDeleteTemplateMutation();

  const [dialog, setDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const templates = esignTemplates?.templates ?? [];

  const uploadTemplate = async () => {
    const convertedToBase64 = await convertFileToBase64Encoding(selectedFile);
    createEsignFromTemplate({
      fileData: convertedToBase64,
      fileName: selectedFile?.file?.name,
      userId: user?.uid,
    });
  };

  const createEsignFromExistingTemplate = (row) =>
    createEsignFromTemplate({ id: row.id, name: row?.name, userId: user?.uid });

  const handleDeleteRow = (rowId) => deleteRow({ id: rowId });

  useEffect(() => {
    if (isDeleteRowSuccess) {
      setShowSnackbar(true);
    }
  }, [isDeleteRowLoading]);

  useEffect(() => {
    if (isCreateTemplateSuccess) {
      setDialog(false);
      setShowSnackbar(true);
    }
  }, [isCreateTemplateLoading]);

  useEffect(() => {
    if (isCreateEsignFromTemplateSuccess) {
      setShowSnackbar(true);
    }
  }, [isCreateEsignFromTemplateLoading]);

  if (isGetEsignTemplatesLoading) return <Skeleton height="10rem" />;

  return (
    <Card elevation={0} sx={{ p: 1, height: "100%" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ margin: "0rem 0rem 1rem 0rem" }}
      >
        <RowHeader
          title="Esign Templates"
          caption="View a list of upto five of your created templates."
          sxProps={{
            fontSize: "0.875rem",
            fontWeight: "bold",
            textAlign: "left",
          }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Add template">
            <Badge badgeContent={templates.length} color="error">
              <Box>
                {medFormFactor ? (
                  <AIconButton
                    size="small"
                    variant="outlined"
                    disabled={templates?.length >= 5}
                    onClick={() => setDialog(!dialog)}
                    label={<AddRounded fontSize="small" />}
                  />
                ) : (
                  <AButton
                    size="small"
                    variant="outlined"
                    label="Add Template"
                    disabled={templates?.length >= 5}
                    onClick={() => setDialog(!dialog)}
                  />
                )}
              </Box>
            </Badge>
          </Tooltip>
        </Stack>
      </Stack>
      <EsignTemplateDetails
        templates={templates}
        handleDeleteRow={handleDeleteRow}
        isDeleteRowLoading={isDeleteRowLoading}
        createEsignFromExistingTemplate={createEsignFromExistingTemplate}
        isCreateEsignFromTemplateLoading={isCreateEsignFromTemplateLoading}
      />
      <Dialog
        open={dialog}
        keepMounted
        fullWidth
        onClose={() => setDialog(!dialog)}
        aria-describedby="alert-dialog-slide-upload-esign-templates"
      >
        <DialogTitle>Upload Esign Template</DialogTitle>
        <DialogContent>
          <UploadDocument
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </DialogContent>
        <DialogActions>
          <Chip
            disabled={!isEsignConnected}
            avatar={
              <Avatar sx={{ bgcolor: "secondary.main", width: 20, height: 20 }}>
                <FiberManualRecordRounded
                  color="primary"
                  sx={{ fontSize: 14 }}
                />
              </Avatar>
            }
            label={!isEsignConnected ? "Esign Offline" : "Esign Online"}
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
            disabled={!isEsignConnected || !selectedFile}
            onClick={uploadTemplate}
            label="Upload Template"
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
