import { ReactNode } from "react";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import ScrollTop from "common/ScrollTop/ScrollToTop";

/**
 * The ScrollTopProviderProps type defines the props for a component that provides functionality for
 * scrolling to the top of a page.
 * @property {ReactNode} children - The `children` property in the `ScrollTopProviderProps` type
 * represents the ReactNode that will be rendered as a child component within the `ScrollTopProvider`.
 * This allows you to wrap other components with the `ScrollTopProvider` and control the scrolling
 * behavior for its children.
 */
type ScrollTopProviderProps = {
  children: ReactNode;
};

export default function ScrollTopProvider({
  children,
}: ScrollTopProviderProps) {
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
