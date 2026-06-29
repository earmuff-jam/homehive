import React, { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import {
  CheckCircleRounded,
  ClearAllRounded,
  CloudCircleRounded,
  CloudUploadRounded,
  DeleteRounded,
  ErrorRounded,
  ImageRounded,
  InfoRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import { pluralize } from "common/utils";
import {
  FileUploadFailedStatusStr,
  FileUploadUploadedStatusStr,
  FileUploadUploadingStatusStr,
  FileUploadWaitingStatusStr,
  MaxSizeInMB,
} from "features/Rent/constants";

const MultipleImagePicker = ({
  value,
  onChange,
  limit = 5,
  handleUpload = null,
}) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (files) => {
    if (value?.length < limit) {
      const validFiles = Array.from(files)
        .slice(0, limit) // to limit images
        .filter((file) => {
          const isImage = file.type.startsWith("image/");
          const validSize = file.size / (1024 * 1024) <= MaxSizeInMB;

          return isImage && validSize;
        })
        .map((file) => ({
          id: uuidv4(),
          file,
          preview: URL.createObjectURL(file),
          status: FileUploadWaitingStatusStr,
        }));

      onChange([...value, ...validFiles]);
    }
  };

  const handleFileUpload = (event) => {
    if (!event.target.files?.length) return;

    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);

    if (event.dataTransfer.files.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const removeImage = (id) => {
    const image = value.find((x) => x.id === id);

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    onChange(value.filter((x) => x.id !== id));
  };

  const clearAll = () => {
    value.forEach((image) => URL.revokeObjectURL(image.preview));
    onChange([]);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      value.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [value]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip
          title={`Images must be under ${MaxSizeInMB}MB and of a valid format.`}
        >
          <InfoRounded
            sx={{
              color: value?.length ? "primary.main" : "secondary.main",
              fontSize: "0.9rem",
            }}
          />
        </Tooltip>

        <Typography flexGrow={1} variant="caption">
          {value?.length
            ? `${value.length} ${pluralize(value?.length, "image")} selected`
            : `Upload up to ${limit} images`}
        </Typography>

        {!!value?.length && (
          <Tooltip title="Remove all images">
            <AIconButton
              color="error"
              size="small"
              onClick={clearAll}
              label={<ClearAllRounded fontSize="small" />}
            />
          </Tooltip>
        )}
      </Stack>

      <input
        hidden
        multiple
        accept="image/*"
        ref={inputRef}
        type="file"
        onChange={handleFileUpload}
      />

      <Paper
        variant="outlined"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        sx={{
          padding: 2,
          cursor: "pointer",
          transition: "250ms",
          textAlign: "center",
          borderStyle: "dashed",
          borderWidth: 2,
          bgcolor: dragging ? "action.hover" : "background.paper",
          borderColor: dragging ? "primary.main" : "divider",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Stack spacing={1} alignItems="center">
          <CloudUploadRounded
            color={dragging ? "primary" : "action"}
            sx={{ fontSize: 40 }}
          />

          <Typography fontWeight={600}>Drag & Drop Images Here</Typography>
          <Typography variant="body2" color="text.secondary">
            or click anywhere to browse
          </Typography>
        </Stack>
      </Paper>

      {value.length > 0 && (
        <Stack spacing={2}>
          {/* stacked image effect */}
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              height: 48,
            }}
          >
            {value.slice(0, 3).map((image, index) => (
              <Paper
                key={image.id}
                elevation={3}
                sx={{
                  width: 42,
                  height: 42,
                  marginLeft: index === 0 ? 0 : -2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `rotate(${(index - 2) * 5}deg)`,
                  zIndex: index,
                }}
              >
                <ImageRounded color="primary" />
              </Paper>
            ))}

            {value.length > 3 && (
              <Paper
                elevation={2}
                sx={{
                  marginLeft: -2,
                  paddingX: 1,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                +{value.length - 3}
              </Paper>
            )}
          </Box>

          <Stack spacing={1}>
            {value.map((image) => (
              <Paper
                key={image.id}
                variant="outlined"
                sx={{
                  paddingX: 2,
                  paddingY: 1,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ImageRounded color="action" />

                  <Box flexGrow={1}>
                    <Typography noWrap fontSize="0.785rem">
                      {image.file.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>

                  {image.status === FileUploadWaitingStatusStr && (
                    <Typography variant="caption" color="text.secondary">
                      Waiting
                    </Typography>
                  )}

                  {image.status === FileUploadUploadingStatusStr && (
                    <Typography variant="caption" color="primary.main">
                      Uploading...
                    </Typography>
                  )}

                  {image.status === FileUploadUploadedStatusStr && (
                    <CheckCircleRounded color="success" />
                  )}

                  {image.status === FileUploadFailedStatusStr && (
                    <ErrorRounded color="error" />
                  )}

                  <Tooltip title="Remove image">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeImage(image.id);
                      }}
                    >
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {handleUpload?.onClick() ? (
              <AButton
                startIcon={<CloudCircleRounded />}
                onClick={handleUpload}
                label={`Upload ${value.length} ${pluralize(value?.length, "image")}`}
              />
            ) : null}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default MultipleImagePicker;
