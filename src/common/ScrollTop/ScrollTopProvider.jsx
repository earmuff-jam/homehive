import React from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import ScrollTop from "common/ScrollTop/ScrollToTop";

/**
 * ScrollTopProvider Component
 *
 * Component built with the provider pattern to create a FAB button
 * that allows the user to navigate to the top when clicked. The div
 * id of "back-to-top-anchor" is the id that allows the fab to scroll
 * to the top of the page.
 *
 */
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
