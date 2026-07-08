import React from "react";

import { Box, Skeleton } from "@mui/material";

const DisplayImages = ({ images = [], isLoading = true, sxProps = {} }) => {
  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  if (isLoading) return <Skeleton height="5rem" />;

  return (
    <Box display="flex" gap={1} sx={{ ...sxProps }}>
      {images.map((image) => (
        <Box
          key={image.id}
          onClick={() => openInNewTab(image?.downloadURL)}
          sx={{ cursor: "pointer" }}
        >
          <img
            src={image?.downloadURL}
            alt="Uploaded image of maintenance issue"
            width={120}
            height={120}
            style={{
              objectFit: "cover",
              borderRadius: 8,
              fontSize: "0.675rem",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default DisplayImages;
