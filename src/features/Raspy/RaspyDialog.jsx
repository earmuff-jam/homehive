import React from "react";

import { AutoAwesomeRounded, CloseRounded } from "@mui/icons-material";
import {
  Box,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RowHeader from "common/RowHeader";
import ChatForm from "features/Raspy/ChatForm";

export default function RaspyDialog({ raspyOpen, setRaspyOpen }) {
  const theme = useTheme();
  const ltMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Drawer
      open={raspyOpen}
      anchor="right"
      sx={{
        width: ltMedFormFactor ? "100%" : 440,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: ltMedFormFactor ? "100%" : 440,
          boxSizing: "border-box",
        },
      }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesomeRounded color="primary" />
            <RowHeader
              title="Raspy Assistant ..."
              caption="How can I help you today?"
            />
          </Stack>
          <Box alignSelf="flex-end">
            <IconButton size="small" onClick={() => setRaspyOpen(false)}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <ChatForm />
      </DialogContent>
    </Drawer>
  );
}
