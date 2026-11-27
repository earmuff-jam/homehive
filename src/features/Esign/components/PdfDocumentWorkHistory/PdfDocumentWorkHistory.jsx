import React from "react";

import { Box, Divider, Typography } from "@mui/material";
import ViewPlacedFields from "features/Esign/components/ViewPlacedFields/ViewPlacedFields";

const PdfDocumentWorkHistory = ({ removeBox, signatureBoxes = [] }) => {
  return (
    <Box
      sx={{
        top: 100,
        padding: 1,
        flex: 1,
        position: "sticky",
        alignSelf: "flex-start",
      }}
    >
      <Divider>
        <Typography variant="body2" color="textSecondary">
          Detailed work history
        </Typography>
      </Divider>
      {signatureBoxes.length > 0 && (
        <ViewPlacedFields
          removeBox={removeBox}
          signatureBoxes={signatureBoxes}
        />
      )}
    </Box>
  );
};

export default PdfDocumentWorkHistory;
