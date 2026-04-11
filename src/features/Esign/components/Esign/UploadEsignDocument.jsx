import React from "react";

import { Box, Button, styled } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
});

export default function UploadEsignDocument({ handleUpload }) {
  return (
    <Box>
      <Button
        role="undefined"
        component="label"
        variant="outlined"
        size="small"
      >
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleUpload} />
      </Button>
    </Box>
  );
}
