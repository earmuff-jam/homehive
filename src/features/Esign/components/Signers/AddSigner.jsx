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
              ? "Only four subsequent signer are allowed"
              : "Add a new signer as a tenant to sign the document"
          }
        >
          <Box paddingLeft="1rem">
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
      </Stack>

      <Typography variant="caption" color="text.secondary">
        <Box>
          {activeSigner ? (
            <>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                paddingY={1}
                gutterBottom
              >
                Select a different name above to switch or add new signer
              </Typography>
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
                <Box paddingY={1}>
                  Placing {activeFieldType} for&nbsp;
                  <strong style={{ color: activeSigner.color }}>
                    {activeSigner.role}
                  </strong>
                  &nbsp; — click and drag on the PDF below to place their&nbsp;
                  {activeFieldType}&nbsp;box. Select a different name above to
                  switch.
                </Box>
                <Divider />
              </Box>
            </>
          ) : (
            <Typography variant="subtitle2" fontWeight="bold">
              Select a signer above, then click and drag on the PDF to place
              their&nbsp;
              {activeFieldType}&nbsp;box.
            </Typography>
          )}
        </Box>
      </Typography>
      {activeSigner && (
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {`Edit ${activeSigner?.role}`}
          </Typography>
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
