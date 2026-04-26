import React from "react";

import { Box, Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import AddSigner from "features/Esign/components/Signers/AddSigner";
import SigningBox from "features/Esign/components/ViewPdf/SigningBox";
import ViewPdf from "features/Esign/components/ViewPdf/ViewPdf";
import ViewSigningFields from "features/Esign/components/ViewPdf/ViewSigningFields";

const ViewFile = ({
  file,
  containerRef,
  signers,
  activeSigner,
  handleSelectSigner,
  updateSignerDetails,
  setScrollTop,
  signatureBoxes,
  removeBox,
  scrollTop,
  pageOffsets,
  activeFieldType,
  setActiveFieldType,
  addFollowUpSigners,
  handleRemoveSigner,
}) => {
  return (
    <>
      {file ? (
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1}
          sx={{
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <ViewPdf
              containerRef={containerRef}
              activeSigner={activeSigner}
              setScrollTop={setScrollTop}
            />

            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "800px",
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              {signatureBoxes.map((box) => (
                <SigningBox
                  key={box.id}
                  createdBox={box}
                  removeBox={removeBox}
                  scrollTop={scrollTop}
                  pageOffsets={pageOffsets}
                />
              ))}
            </Box>

            {signatureBoxes.length > 0 && (
              <ViewSigningFields
                removeBox={removeBox}
                signatureBoxes={signatureBoxes}
              />
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              padding: 1,
              top: 100,
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
          </Box>
        </Stack>
      ) : (
        <EmptyComponent caption="Upload pdf file to begin." />
      )}
    </>
  );
};

export default ViewFile;
