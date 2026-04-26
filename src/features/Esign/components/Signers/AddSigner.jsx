import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { CancelRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import RowHeader from "common/RowHeader";
import EditSigners from "features/Esign/components/Signers/EditSigners";

// DefaultSigners ...
// defines the default signers
const DefaultSigners = {
  name: "",
  email_address: "",
};

const AddSigner = ({
  signers = [],
  activeSigner,
  setActiveSigner,
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
    defaultValues: DefaultSigners,
  });

  const onSubmit = (data) => {
    updateSignerDetails({ ...data, role: activeSigner?.role });
    reset(DefaultSigners);
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
          <Tooltip title={`Edit name and email for ${activeSigner?.role}`}>
            <Box data-tour="esign-7"></Box>
          </Tooltip>
          {signers.map((signer) => (
            <Chip
              key={signer.id}
              size="small"
              label={signer.role}
              onClick={() => setActiveSigner(signer)}
              onDelete={() => handleRemoveSigner(signer.id)}
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
        <Box>
          <Tooltip
            title={
              signers?.length >= 5
                ? "Only four subsequent signer are allowed"
                : "Add a new signer as a tenant to sign the document"
            }
          >
            <Box>
              <Button
                size="small"
                variant="outlined"
                onClick={addFollowUpSigners}
                disabled={signers?.length >= 5}
              >
                Add new signer
              </Button>
            </Box>
          </Tooltip>
        </Box>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        <Box data-tour="esign-7">
          {activeSigner ? (
            <>
              <Box paddingY={1}>
                Placing {activeFieldType} for&nbsp;
                <strong style={{ color: activeSigner.color }}>
                  {activeSigner.role}
                </strong>
                &nbsp; — click and drag on the PDF below to place their&nbsp;
                {activeFieldType}&nbsp;box. Select a different name above to
                switch.
              </Box>
              <Box sx={{ marginBottom: 1 }}>
                <Stack direction="row" spacing={1} data-tour="esign-5">
                  <Button
                    size="small"
                    variant={
                      activeFieldType === "signature" ? "contained" : "outlined"
                    }
                    onClick={() => setActiveFieldType("signature")}
                  >
                    Signature
                  </Button>

                  <Button
                    size="small"
                    variant={
                      activeFieldType === "date" ? "contained" : "outlined"
                    }
                    onClick={() => setActiveFieldType("date")}
                  >
                    Date
                  </Button>
                </Stack>
              </Box>
            </>
          ) : (
            <>
              Select a signer above, then click and drag on the PDF to place
              their&nbsp;
              {activeFieldType}&nbsp;box.
            </>
          )}
        </Box>
      </Typography>
      <Divider />
      {activeSigner && (
        <Paper sx={{ padding: 2 }}>
          <RowHeader
            title={`Edit ${activeSigner?.role?.toLowerCase()} details`}
            caption={`Edit ${activeSigner?.role?.toLowerCase()} details for E-sign`}
            sxProps={{ textAlign: "left" }}
          />
          <EditSigners control={control} errors={errors} />
          <Stack alignItems="flex-end" marginTop={1}>
            <Button
              variant="outlined"
              size="small"
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default AddSigner;
