import React from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import ScrollTop from "common/ScrollTop/ScrollToTop";

// ScrollTopProvider ...
// defines a provider function that creates a FAB button to allow
// users to scroll to the top when selected.
export default function ScrollTopProvider({ children }) {
  return (
    <>
      {/* back to top fab anchor entrypoint for hook */}
      <Box id="back-to-top-anchor" />
      {children}
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </>
  );
}
