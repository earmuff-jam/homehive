import React, { useState } from "react";

import { CancelRounded, EditRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import RowHeader from "common/RowHeader";
import EditSigners from "features/Esign/components/Signers/EditSigners";

const AddSigner = ({
  signers = [],
  activeSigner,
  setActiveSigner,
  updateSignerDetails,
  addFollowUpSigners,
  handleRemoveSigner,
}) => {
  const [edit, setEdit] = useState(null);
  return (
    <Stack spacing={1} marginBottom="1rem">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
          <Tooltip title={`Edit name and email for ${activeSigner?.role}`}>
            <Button
              size="small"
              variant="contained"
              disabled={!activeSigner}
              onClick={() => setEdit(activeSigner?.role)}
              startIcon={<EditRounded fontSize="small" />}
            >
              Edit {activeSigner?.role}
            </Button>
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

      <Dialog
        open={Boolean(edit)}
        keepMounted
        fullWidth
        maxWidth="sm"
        onClose={() => setEdit(null)}
        aria-describedby="update-signer-data-dialog-box"
      >
        <DialogTitle>
          <RowHeader
            title={`Edit ${activeSigner?.role?.toLowerCase()} details`}
            caption={`Edit ${activeSigner?.role?.toLowerCase()} details for E-sign`}
            sxProps={{ textAlign: "left" }}
          />
        </DialogTitle>
        <DialogContent>
          <EditSigners
            setEdit={setEdit}
            signers={signers}
            role={activeSigner?.role}
            updateSignerDetails={updateSignerDetails}
          />
        </DialogContent>
      </Dialog>

      <Typography variant="caption" color="text.secondary">
        {activeSigner ? (
          <>
            Placing signature for&nbsp;
            <strong style={{ color: activeSigner.color }}>
              {activeSigner.role}
            </strong>
            &nbsp; — click and drag on the PDF below to place their signature
            box. Select a different name above to switch.
          </>
        ) : (
          <>
            Select a signer above, then click and drag on the PDF to place their
            signature box.
          </>
        )}
      </Typography>
      <Divider />
    </Stack>
  );
};

export default AddSigner;
