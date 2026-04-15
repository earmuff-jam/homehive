import React from "react";

import { CancelRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const SigningBox = ({ pageOffsets, createdBox, removeBox, scrollTop }) => {
  // used to mark date boxes differently
  const isDate = createdBox.fieldType === "date";
  const pageOffset = pageOffsets.current[createdBox.pageNum] ?? 0;
  // pageOffset is relative to the scroll container's inner content.
  // Subtract scrollTop to get the visible position, then add
  // CONTAINER_PADDING_TOP to account for the container's top padding.
  const top = pageOffset + createdBox.screenY - scrollTop;

  return (
    <Box
      key={createdBox.id}
      sx={{
        position: "absolute",
        left: createdBox.screenX,
        top,
        width: createdBox.screenW,
        height: createdBox.screenH,
        border: `2px solid ${createdBox.color}`,
        backgroundColor: `${createdBox.color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
        borderRadius: "2px",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: createdBox.color,
          fontWeight: 700,
          fontSize: "12px",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {createdBox.signerRole}&nbsp;&#8212;&nbsp;
        <Box component="span" textTransform="capitalize">
          {createdBox.fieldType}
        </Box>
      </Typography>

      {/* Delete button */}
      <CancelRounded
        onClick={() => removeBox(createdBox.id)}
        sx={{
          position: "absolute",
          top: -8,
          right: -8,
          fontSize: 16,
          color: createdBox.color,
          cursor: "pointer",
          backgroundColor: "white",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
};

export default SigningBox;
