import React from "react";

import { Box, Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import SigningBox from "features/Esign/components/ViewPdf/SigningBox";
import ViewPdf from "features/Esign/components/ViewPdf/ViewPdf";
import ViewPlacedFields from "features/Esign/components/ViewPlacedFields/ViewPlacedFields";

const ViewFile = ({
  file,
  containerRef,
  activeSigner,
  setScrollTop,
  signatureBoxes,
  removeBox,
  scrollTop,
  pageOffsets,
}) => {
  return (
    <Stack>
      {file ? (
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: "center"
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
          </Box>
          <Stack
            spacing={1}
            sx={{
              top: 100,
              padding: 1,
              maxWidth: "30%",
              position: "sticky",
              alignSelf: "flex-start",
            }}
          >
            {signatureBoxes.length > 0 && (
              <ViewPlacedFields
                removeBox={removeBox}
                signatureBoxes={signatureBoxes}
              />
            )}
          </Stack>
        </Stack>
      ) : (
        <EmptyComponent caption="Upload pdf file to begin." />
      )}
    </Stack>
  );
};

export default ViewFile;
