import React from "react";

import { PermIdentityRounded } from "@mui/icons-material";
import { Alert, Paper, Stack, Typography } from "@mui/material";

const ViewSigners = ({ tokenCount = 0, signers = [], signatureBoxes = [] }) => {
  const acuteDateBoxes = signatureBoxes?.filter(
    (box) => box.fieldType === "date",
  );
  const acuteSignatureBoxes = signatureBoxes?.filter(
    (box) => box.fieldType === "signature",
  );
  const isSignatureBoxesMatchesSigners =
    acuteSignatureBoxes?.length !== signers?.length;
  const isDateBoxesMatchesSigners = acuteDateBoxes?.length !== signers?.length;
  const isRequiredFieldsMissing =
    signers?.length !==
      signers?.filter((signer) => signer?.email_address).length ||
    signers?.length !== signers?.filter((signer) => signer?.name).length;

  return (
    <Stack paddingTop="1rem">
      <Stack spacing={1}>
        {isSignatureBoxesMatchesSigners ? (
          <Alert severity="error">
            <Typography variant="caption">
              {`You have ${signers?.length} signers but ${acuteSignatureBoxes?.length} signature boxes. Is this correct?`}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="success">
            <Typography variant="caption">
              Found {acuteSignatureBoxes?.length} signature boxes.
            </Typography>
          </Alert>
        )}

        {isDateBoxesMatchesSigners ? (
          <Alert severity="error">
            <Typography variant="caption">
              {`You have ${signers?.length} signers but ${acuteDateBoxes?.length} date boxes. Is this correct?`}
            </Typography>
          </Alert>
        ) : (
          <Alert severity="success">
            <Typography variant="caption">
              Found {acuteDateBoxes?.length} date boxes.
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

        {tokenCount <= 0 ? (
          <Alert severity="error">
            <Typography variant="caption">
              Not enough tokens to send electronic signature.
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
                <Typography variant="caption">
                  {signer?.email_address}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ViewSigners;
