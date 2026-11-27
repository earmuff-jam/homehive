import React from "react";

import { PermIdentityRounded } from "@mui/icons-material";
import { Paper, Stack, Typography } from "@mui/material";

const PdfDocumentReviewSigners = ({ signers = [] }) => {
  return (
    <Stack spacing={1}>
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

export default PdfDocumentReviewSigners;
