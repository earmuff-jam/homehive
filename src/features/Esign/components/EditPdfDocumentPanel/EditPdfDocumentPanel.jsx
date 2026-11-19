import React from "react";

import { Box } from "@mui/material";
import AddSigner from "features/Esign/components/Signers/AddSigner";
import ViewPlacedFields from "features/Esign/components/ViewPlacedFields/ViewPlacedFields";

const EditPdfDocumentPanel = ({
  signers,
  activeSigner,
  handleSelectSigner,
  activeFieldType,
  setActiveFieldType,
  updateSignerDetails,
  addFollowUpSigners,
  handleRemoveSigner,
  removeBox,
  signatureBoxes = [],
}) => {
  return (
    <Box
      sx={{
        top: 100,
        padding: 1,
        maxWidth: "30%",
        position: "sticky",
        alignSelf: "flex-start",
      }}
    >
      <AddSigner
        signers={signers}
        activeSigner={activeSigner}
        handleSelectSigner={handleSelectSigner}
        activeFieldType={activeFieldType}
        setActiveFieldType={setActiveFieldType}
        updateSignerDetails={updateSignerDetails}
        addFollowUpSigners={addFollowUpSigners}
        handleRemoveSigner={handleRemoveSigner}
      />
      {signatureBoxes.length > 0 && (
        <ViewPlacedFields
          removeBox={removeBox}
          signatureBoxes={signatureBoxes}
        />
      )}
    </Box>
  );
};

export default EditPdfDocumentPanel;
