import React from "react";

import { Stack } from "@mui/material";

const ViewPdf = ({
  containerRef,
  paddingTopPx,
  activeSigner,
  setScrollTop,
}) => {
  return (
    <Stack
      ref={containerRef}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      sx={{
        paddingTop: `${paddingTopPx}px`,
        height: "800px",
        overflow: "auto",
        width: "fit-content",
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        cursor: activeSigner ? "crosshair" : "default",
        userSelect: "none",
      }}
    />
  );
};

export default ViewPdf;
