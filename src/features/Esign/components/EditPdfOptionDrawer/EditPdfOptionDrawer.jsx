import React from "react";

import { CancelOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AIconButton from "common/AIconButton";
import ViewFormTemplates from "features/Esign/components/FormTemplates/ViewFormTemplates";
import AddSigner from "features/Esign/components/Signers/AddSigner";

const EditPdfOptionDrawer = ({
  isOpen = false,
  setIsOpen,
  options,
  getEditablePdfDocument,
  signers,
  activeSigner,
  handleSelectSigner,
  activeFieldType,
  setActiveFieldType,
  updateSignerDetails,
  addFollowUpSigners,
  handleRemoveSigner,
}) => {
  const theme = useTheme();
  const ltMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      aria-modal="true"
      sx={{
        width: ltMedFormFactor ? "100%" : 500,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: ltMedFormFactor ? "100%" : 500,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        sx={{
          height: "100%",
          minHeight: 0,
          padding: 1,
          marginTop: 1,
        }}
      >
        <Stack padding={1} spacing={1}>
          <Stack
            marginBottom={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="bold" color="text.secondary">
              Edit Pdf Options
            </Typography>

            <AIconButton
              size="small"
              onClick={() => setIsOpen(false)}
              label={<CancelOutlined color="error" fontSize="small" />}
            />
          </Stack>

          <Divider />
        </Stack>
        <ViewFormTemplates
          savedOptions={options}
          handleUpload={getEditablePdfDocument}
        />
        <AddSigner
          signers={signers}
          activeSigner={activeSigner}
          handleSelectSigner={handleSelectSigner}
          activeFieldType={activeFieldType}
          setActiveFieldType={setActiveFieldType}
          updateSignerDetails={updateSignerDetails}
          addFollowUpSigners={addFollowUpSigners}
          handleRemoveSigner={handleRemoveSigner}
        />
      </Stack>
    </Drawer>
  );
};

export default EditPdfOptionDrawer;
