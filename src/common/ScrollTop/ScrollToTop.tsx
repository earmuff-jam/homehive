import { ReactNode } from "react";

import { Box, Fade, useScrollTrigger } from "@mui/material";

/**
 * The ScrollTopProps type defines a prop object with a children property of type ReactNode.
 * @property {ReactNode} children - The `children` property in the `ScrollTopProps` type is of type
 * `ReactNode`. This means that the `children` prop can accept any valid React node as its value, such
 * as JSX elements, strings, or numbers.
 */
export type ScrollTopProps = {
  children: ReactNode;
};

export default function ScrollTop({ children }: ScrollTopProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    const anchor = document.querySelector("#back-to-top-anchor");
    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}
