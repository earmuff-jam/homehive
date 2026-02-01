import React from "react";

import { Controller } from "react-hook-form";

import { CloudCircleRounded } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";

export default function EsignAgreement({
  control,
  onSubmit,
  isEsignLinkDisabled,
  isButtonComponentLoading,
}) {
  return (
    <form onSubmit={onSubmit}>
      <Stack alignContent="center">
        <Controller
          name="noComplianceDisclaimerAgreement"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label={
                <Typography variant="caption">
                  The property owner, manager or broker is responsible for
                  ensuring compliance with the Appropriate Property Code and
                  Local Laws.
                </Typography>
              }
            />
          )}
        />
        <Controller
          name="noLegalAdviceDisclaimerAgreement"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label={
                <Typography variant="caption">
                  The documents provided are not a substitute for professional
                  legal advice and may not address all legal requirements
                  applicable to your specific situation.
                </Typography>
              }
            />
          )}
        />

        <Box>
          <AButton
            sx={{ mt: 2 }}
            startIcon={<CloudCircleRounded fontSize="small" />}
            label="Link Esign"
            variant="contained"
            type="submit"
            disabled={isEsignLinkDisabled}
            loading={isButtonComponentLoading}
          />
        </Box>
      </Stack>
    </form>
  );
}
