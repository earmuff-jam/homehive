import React from "react";

import { Controller } from "react-hook-form";

import {
  AddCircleOutlineRounded,
  CalendarMonthRounded,
  CancelRounded,
  GestureOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import { ACTIVE_FORM_TYPE_ENUM_VALUES } from "features/Esign/constants";

const EditPdfDocumentPanel = ({
  signerFields = [],
  control,
  errors,
  signers = [],
  activeSigner,
  handleSelectSigner,
  handleSelectFieldType,
  activeFieldType,
  addFollowUpSigners,
  handleRemoveSigner,
}) => {
  const getFieldRules = (fieldName) => ({
    required: `${fieldName} is required`,
    validate: (value) =>
      (value || "").trim().length > 3 ||
      `${fieldName} must be more than 3 characters`,
    maxLength: {
      value: 300,
      message: `${fieldName} should be less than 300 characters`,
    },
  });

  return (
    <Box
      sx={{
        top: 100,
        padding: 1,
        flex: 1,
        position: "sticky",
        alignSelf: "flex-start",
      }}
    >
      <Stack spacing={1} marginBottom="1rem" data-tour="esign-4">
        <Divider>
          <Typography variant="caption" color="textSecondary">
            Signer Information
          </Typography>
        </Divider>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          data-tour="esign-6"
        >
          <Typography variant="body2" color="textSecondary">
            Manage document signers
          </Typography>

          <Tooltip
            title={
              signers.length >= 5
                ? "Only four subsequent signers allowed"
                : "Add new signer for the document"
            }
          >
            <AButton
              size="small"
              color="primary"
              onClick={addFollowUpSigners}
              disabled={signers.length >= 5}
              variant="outlined"
              startIcon={<AddCircleOutlineRounded fontSize="small" />}
              label="Add Signer"
            />
          </Tooltip>
        </Stack>

        <Box>
          {activeSigner ? (
            <Stack gap={1}>
              <Typography variant="body2" color="textSecondary">
                Placing {activeFieldType} for&nbsp;
                <strong style={{ color: activeSigner.color }}>
                  {activeSigner.role}
                </strong>
                &nbsp; — click and drag on the PDF to place their&nbsp;
                {activeFieldType} box.
              </Typography>
              <Divider />
            </Stack>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Select a signer, then click and drag on the PDF to place
              their&nbsp;
              {activeFieldType} box.
            </Typography>
          )}
        </Box>

        <Stack spacing={1} sx={{ maxHeight: 420, overflowY: "auto" }}>
          {signerFields.map((fieldSigner, index) => {
            const signer = signers[index] || fieldSigner;
            const isActive = activeSigner?.id === signer.id;
            const signerErrors = errors?.signers?.[index];

            return (
              <Paper
                key={fieldSigner.fieldId}
                variant="outlined"
                onClick={() => handleSelectSigner(signer)}
                sx={{
                  width: "100%",
                  borderColor: isActive ? signer.color : "divider",
                  p: 2,
                  borderWidth: 2,
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight="bold" sx={{ color: signer.color }}>
                      {signer.role}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      data-tour="esign-5"
                    >
                      <Tooltip title="Place signature">
                        <AIconButton
                          size="small"
                          color={
                            isActive &&
                            activeFieldType ===
                              ACTIVE_FORM_TYPE_ENUM_VALUES.Signature
                              ? "primary"
                              : "default"
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSelectFieldType(
                              signer,
                              ACTIVE_FORM_TYPE_ENUM_VALUES.Signature,
                            );
                          }}
                          label={<GestureOutlined fontSize="small" />}
                        />
                      </Tooltip>

                      <Tooltip title="Place date">
                        <AIconButton
                          size="small"
                          color={
                            isActive &&
                            activeFieldType ===
                              ACTIVE_FORM_TYPE_ENUM_VALUES.Date
                              ? "primary"
                              : "default"
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSelectFieldType(
                              signer,
                              ACTIVE_FORM_TYPE_ENUM_VALUES.Date,
                            );
                          }}
                          label={<CalendarMonthRounded fontSize="small" />}
                        />
                      </Tooltip>

                      {signer.id !== "creator" && (
                        <Tooltip title="Remove signer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRemoveSigner(signer.id);
                            }}
                          >
                            <CancelRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Stack>

                  <Controller
                    name={`signers.${index}.name`}
                    control={control}
                    rules={getFieldRules("Full name")}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Full Name"
                        placeholder="Enter full name"
                        error={!!signerErrors?.name}
                        helperText={signerErrors?.name?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`signers.${index}.email_address`}
                    control={control}
                    rules={getFieldRules("Email address")}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Email Address"
                        placeholder="Enter email address"
                        error={!!signerErrors?.email_address}
                        helperText={signerErrors?.email_address?.message}
                      />
                    )}
                  />
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditPdfDocumentPanel;
