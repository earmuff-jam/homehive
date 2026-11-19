import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import {
  AddCircleOutlineRounded,
  CalendarMonthRounded,
  CancelRounded,
  GestureOutlined,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import EditSigners from "features/Esign/components/Signers/EditSigners";
import { ACTIVE_FORM_TYPE_ENUM_VALUES } from "features/Esign/constants";

// SIGNER_FORM_FIELDS_ENUM_VALUES ...
// defines the signer form fields
const SIGNER_FORM_FIELDS_ENUM_VALUES = {
  name: "",
  email_address: "",
};

const AddSigner = ({
  signers = [],
  activeSigner,
  handleSelectSigner,
  activeFieldType,
  setActiveFieldType,
  updateSignerDetails,
  addFollowUpSigners,
  handleRemoveSigner,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: SIGNER_FORM_FIELDS_ENUM_VALUES,
  });

  const onSubmit = (data) => {
    updateSignerDetails({ ...data, role: activeSigner?.role });
    reset(SIGNER_FORM_FIELDS_ENUM_VALUES);
  };

  useEffect(() => {
    const activeSignerRole = activeSigner?.role;
    const selectedSigner = signers?.find(
      (signer) => signer?.role === activeSignerRole,
    );
    if (selectedSigner) {
      reset({
        name: selectedSigner?.name,
        email_address: selectedSigner?.email_address,
      });
    }
  }, [signers, activeSigner?.role]);

  return (
    <Stack spacing={1} marginBottom="1rem" data-tour="esign-4">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        data-tour="esign-6"
      >
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
          {signers.map((signer) => (
            <Chip
              key={signer.id}
              size="small"
              label={signer.role}
              onClick={() => handleSelectSigner(signer)}
              onDelete={
                signer.id !== "creator"
                  ? () => handleRemoveSigner(signer.id)
                  : null
              }
              deleteIcon={<CancelRounded fontSize="small" />}
              sx={{
                fontWeight: 600,
                borderStyle: "solid",
                borderWidth: 2,
                borderColor: signer.color,
                backgroundColor:
                  activeSigner?.id === signer.id ? signer.color : "transparent",
                color: activeSigner?.id === signer.id ? "#fff" : signer.color,
                "& .MuiChip-deleteIcon": {
                  color: activeSigner?.id === signer.id ? "#fff" : signer.color,
                },
                transition: "all 0.15s ease",
              }}
            />
          ))}
        </Stack>
        <Tooltip
          title={
            signers?.length >= 5
              ? "Only four subsequent signers allowed"
              : "Add new signer for the document"
          }
        >
          <AIconButton
            size="small"
            color="primary"
            onClick={addFollowUpSigners}
            disabled={signers?.length >= 5}
            label={<AddCircleOutlineRounded fontSize="small" />}
          />
        </Tooltip>
      </Stack>

      <Box>
        {activeSigner ? (
          <>
            <Stack gap={1}>
              <Typography>
                Placing {activeFieldType} for&nbsp;
                <strong style={{ color: activeSigner.color }}>
                  {activeSigner.role}
                </strong>
                &nbsp; — click and drag on the PDF to place their&nbsp;
                {activeFieldType}&nbsp;box.
              </Typography>
              <Divider />
              <Stack direction="row" spacing={1} data-tour="esign-5">
                <AButton
                  size="small"
                  variant={
                    activeFieldType === ACTIVE_FORM_TYPE_ENUM_VALUES.Signature
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setActiveFieldType(ACTIVE_FORM_TYPE_ENUM_VALUES.Signature)
                  }
                  startIcon={<GestureOutlined fontSize="small" />}
                  label={ACTIVE_FORM_TYPE_ENUM_VALUES.Signature}
                />
                <AButton
                  size="small"
                  variant={
                    activeFieldType === ACTIVE_FORM_TYPE_ENUM_VALUES.Date
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setActiveFieldType(ACTIVE_FORM_TYPE_ENUM_VALUES.Date)
                  }
                  startIcon={<CalendarMonthRounded fontSize="small" />}
                  label={ACTIVE_FORM_TYPE_ENUM_VALUES.Date}
                />
              </Stack>
            </Stack>
          </>
        ) : (
          <Typography>
            Select a signer above, then click and drag on the PDF to place
            their&nbsp;
            {activeFieldType}&nbsp;box.
          </Typography>
        )}
      </Box>
      {activeSigner && (
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {`Edit ${activeSigner?.role}`}
          </Typography>
          <EditSigners control={control} errors={errors} />
          <Stack alignItems="flex-end" marginTop={1}>
            <AButton
              size="small"
              variant="outlined"
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
              label="Save"
            />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default AddSigner;
