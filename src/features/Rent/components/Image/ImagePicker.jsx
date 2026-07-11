import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import {
  CloseRounded,
  CloudCircleRounded,
  InfoRounded,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AButton from "common/AButton";
import { MaxSizeInMB } from "features/Rent/constants";

const ImagePicker = ({ uploadToCloud }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;
    const imageType = file.type.startsWith("image/");
    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB > MaxSizeInMB || !imageType) {
      setSelectedImage(null);
      event.target.value = "";
    } else {
      setSelectedImage(file);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // fn used to upload image to cloud
  const uploadFile = () => {
    uploadToCloud(uuidv4(), selectedImage);
  };

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={0.2} alignItems={"center"}>
        <Tooltip title="Images should be less than 5MB and be of either png, jpg, jpeg or svg format">
          <InfoRounded
            sx={{
              color: selectedImage ? "primary.main" : "secondary.main",
              fontSize: "0.875rem",
            }}
          />
        </Tooltip>
        <Typography flexGrow={1} variant="caption">
          Select an image
        </Typography>
        {selectedImage ? (
          <IconButton color="error" size="small" onClick={handleCancel}>
            <CloseRounded fontSize="small" />
          </IconButton>
        ) : null}
      </Stack>
      <input
        type="file"
        ref={fileInputRef}
        style={{ cursor: "pointer" }}
        onChange={handleFileUpload}
      />
      <Box textAlign="center">
        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 1,
              border: 1,
              borderColor: "divider",
            }}
          />
        )}
      </Box>

      <AButton
        startIcon={<CloudCircleRounded fontSize="small" />}
        disabled={!selectedImage}
        onClick={uploadFile}
        label="Attach"
      />
    </Stack>
  );
};

export default ImagePicker;
