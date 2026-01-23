import React, { useState } from "react";

import dayjs from "dayjs";

import { CloudUploadRounded } from "@mui/icons-material";
import { Box, Paper, Stack } from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import FileDetails from "features/Rent/components/UploadDocument/FileDetails";

export default function UploadDocument({ selectedFile, setSelectedFile }) {
  const user = fetchLoggedInUser();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const reset = () => setSelectedFile(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (file.type.includes("pdf") || file.type.includes("csv")) {
      setSelectedFile({
        file,
        size: sizeInMB,
        created: dayjs().toISOString(),
        createdBy: user?.uid,
        updated: dayjs().toISOString(),
        updatedBy: user?.uid,
      });
      setShowSnackbar(true); // only for correct file
    }
    // allows users to add the same file
    event.target.value = null;
  };

  return (
    <Stack>
      <Paper sx={{ p: 3 }}>
        <Stack alignItems="center">
          <Box>
            <input
              accept="*"
              id="upload-file-input"
              type="file"
              disabled={Boolean(selectedFile)}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>

          <label htmlFor="upload-file-input">
            <AButton
              size="small"
              variant="outlined"
              component="span"
              label="Select File"
              disabled={Boolean(selectedFile)}
              startIcon={<CloudUploadRounded fontSize="small" />}
            />
          </label>
        </Stack>
        <FileDetails selectedFile={selectedFile} reset={reset} />
      </Paper>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Document scan completed successfully."
        severity="success"
      />
    </Stack>
  );
}
