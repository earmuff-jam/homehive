import React from "react";

import dayjs from "dayjs";

import {
  CloseOutlined,
  DescriptionOutlined,
} from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/material";
import AIconButton from "common/AIconButton";

export default function FileDetails({ selectedFile, reset }) {
  if (!selectedFile) {
    return (
      <Stack sx={{ marginTop: "2rem" }}>
        <Typography
          textAlign="center"
          variant="subtitle2"
          color="textSecondary"
        >
          Select a pdf file to validate and upload
        </Typography>
      </Stack>
    );
  }
  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      padding="2rem 0rem 0rem 1rem"
      alignItems="center"
      spacing={1}
    >
      <Avatar sx={{ bgcolor: "primary.main", width: 70, height: 70 }}>
        <DescriptionOutlined fontSize="large"/>
      </Avatar>
      <Stack direction="column">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" color="textSecondary" flexGrow={1}>
            File Name: {selectedFile?.file?.name}
          </Typography>
          <AIconButton
            size="small"
            color="error"
            onClick={reset}
            label={<CloseOutlined fontSize="small" />}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography
            variant="caption"
            color="textSecondary"
            fontStyle="italic"
          >
            Type: {selectedFile?.file?.type}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            fontStyle="italic"
          >
            Size: {selectedFile?.size || "-"} MB
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            fontStyle="italic"
          >
            {`Last modified ${dayjs(selectedFile.lastModified).format("DD/MM/YYYY")}`}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
