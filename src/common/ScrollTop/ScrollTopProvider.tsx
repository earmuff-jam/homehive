import { ReactNode } from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import ScrollTop from "common/ScrollTop/ScrollToTop";

// type TScrollTopProviderProps ...
type TScrollTopProviderProps = {
  children: ReactNode;
};

export default function ScrollTopProvider({
  children,
}: TScrollTopProviderProps) {
  return (
    <>
      {/* fab anchor entrypoint */}
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
