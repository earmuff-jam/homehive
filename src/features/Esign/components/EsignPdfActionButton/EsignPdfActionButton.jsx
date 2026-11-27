import React from "react";

import { v4 as uuidv4 } from "uuid";

import { CurrencyLiraRounded } from "@mui/icons-material";
import { Box, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import AButton from "common/AButton";
import UploadEsignDocument from "features/Esign/components/Esign/UploadEsignDocument";
import ViewTokenMenu from "features/Esign/components/TokenMenu/ViewTokenMenu";
import { GLITTER_KEYFRAMES } from "features/Esign/constants";

const EsignPdfActionButton = ({
  validTokensForETSS,
  tokenAnchor,
  setTokenAnchor,
  ltMediumFormFactor,
  getEditablePdfDocument,
  handlePrepareEsign,
  file,
  fields,
  selectedEsignDocument,
  isLoadingValidTokensForETSS,
  isCreateEsignDocumentLoading,
}) => {
  const isTokenAnchorOpen = Boolean(tokenAnchor);

  const handleCloseTokenAnchorMenu = () => setTokenAnchor(null);
  const handleClickTokenAnchorMenu = (event) => {
    event.stopPropagation();
    setTokenAnchor(event.currentTarget);
  };

  if (isLoadingValidTokensForETSS) return <Skeleton height="5rem" />;

  return (
    <Stack>
      <Tooltip
        title={
          !isTokenAnchorOpen ? "Add non-refundable tokens for E-sign" : null
        }
      >
        <Stack
          spacing={1}
          direction="row"
          alignItems="flex-end"
          justifyContent="center"
          onClick={handleClickTokenAnchorMenu}
          data-tour="esign-1"
          sx={{
            border: 1,
            paddingY: 0.5,
            marginBottom: 0.5,
            cursor: "pointer",
            borderColor: "primary.main",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              animation: `${GLITTER_KEYFRAMES} 1s ease-in-out infinite`,
            }}
          >
            <CurrencyLiraRounded fontSize="small" color="primary" />
          </Box>
          <Typography variant="caption" color="primary">
            Non-Refundable Tokens: {validTokensForETSS}
          </Typography>
        </Stack>
      </Tooltip>
      <ViewTokenMenu
        anchorEl={tokenAnchor}
        open={isTokenAnchorOpen}
        handleClose={handleCloseTokenAnchorMenu}
      />
      <Stack direction="row" spacing={1}>
        <UploadEsignDocument
          isDisabled={ltMediumFormFactor}
          handleUpload={getEditablePdfDocument}
        />
        <Box data-tour="esign-7">
          <AButton
            size="small"
            variant="contained"
            onClick={() =>
              handlePrepareEsign(selectedEsignDocument?.id || uuidv4())
            }
            disabled={!file || fields.length === 0}
            isLoading={isCreateEsignDocumentLoading}
            label="Prepare Esign"
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default EsignPdfActionButton;
