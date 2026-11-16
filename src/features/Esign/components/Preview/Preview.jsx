import React from "react";

import { Document, Page } from "react-pdf";

import { Skeleton, Stack } from "@mui/material";

const Preview = ({ data, isLoading }) => {
  if (isLoading) {
    return <Skeleton height="10rem" />;
  }

  const file = data?.file;

  if (!file) return null;

  return (
    <Stack
      alignItems="center"
      sx={{
        maxHeight: 180,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Document file={file}>
        <Page
          pageNumber={1}
          width={130}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </Stack>
  );
};

export default Preview;
