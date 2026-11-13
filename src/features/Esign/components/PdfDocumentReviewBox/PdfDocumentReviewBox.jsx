import React from "react";

import { Alert, Typography } from "@mui/material";

const PdfDocumentReviewBox = ({
  isValid = true,
  errorStr = "",
  successStr = "",
}) =>
  isValid ? (
    successStr !== "" && (
      <Alert severity="success">
        <Typography variant="caption">{successStr}</Typography>
      </Alert>
    )
  ) : (
    <Alert severity="error">
      <Typography variant="caption">{errorStr}</Typography>
    </Alert>
  );

export default PdfDocumentReviewBox;
