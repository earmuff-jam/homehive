import React from "react";

import { PermIdentityRounded } from "@mui/icons-material";
import { Alert, Paper, Stack, Typography } from "@mui/material";

const ViewSigners = ({ signers = [], signatureBoxes = [] }) => {
  const isSignatureBoxesMatchesSigners =
    signatureBoxes?.length !== signers?.length;
  const isRequiredFieldsMissing =
    signers?.filter((signer) => signer?.email).filter(Boolean)?.length <= 0;
  return (
    <Stack paddingTop="1rem">
      <Stack spacing={1}>
        {isSignatureBoxesMatchesSigners ? (
          <Alert severity="error">
            <Typography variant="caption">
              You have {signers?.length} signers but only{" "}
              {signatureBoxes?.length} signature boxes. Is this correct?
            </Typography>
          </Alert>
        ) : (
          <Alert severity="success">
            <Typography variant="caption">
              Found {signatureBoxes?.length} signature boxes.
            </Typography>
          </Alert>
        )}

        {isRequiredFieldsMissing ? (
          <Alert severity="error">
            <Typography variant="caption">
              Missing required fields. Please ensure full name and email is
              filled out for each signer including the Creator.
            </Typography>
          </Alert>
        ) : null}
      </Stack>

      <Typography variant="subtitle2" gutterBottom>
        Assigned Signers:
      </Typography>
      <Paper sx={{ padding: 1 }}>
        <Stack>
          {signers?.map((signer) => (
            <Stack
              spacing={1}
              paddingY={1}
              direction="row"
              key={signer.id}
              alignItems="center"
            >
              <PermIdentityRounded
                fontSize="small"
                sx={{ color: signer?.color }}
              />
              <Stack>
                <Typography variant="caption">{signer?.role}</Typography>
                <Typography variant="caption">{signer?.email}</Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ViewSigners;
