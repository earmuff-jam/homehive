import React from "react";

import { Alert } from "@mui/material";

export const LOW_TOKEN_TEXT =
  "Your token is low. Purchase Tokens to send Electronic Signature.";

export const NO_TOKEN_TEXT =
  "You do not have enough tokens to send Electronic Signature. Purchase Tokens to send Electronic Signature.";

const ViewTokenAlert = ({ tokenCount = 0 }) => {
  if (tokenCount === 0) {
    return (
      <Alert severity="warning" sx={{ marginY: 1 }}>
        {NO_TOKEN_TEXT}
      </Alert>
    );
  } else if (tokenCount <= 2) {
    return (
      <Alert severity="warning" sx={{ marginY: 1 }}>
        {LOW_TOKEN_TEXT}
      </Alert>
    );
  }
  return null;
};

export default ViewTokenAlert;
