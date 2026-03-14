import React from "react";

import { AutoAwesomeRounded, CloseRounded } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import { fetchLoggedInUser } from "common/utils";
import { useGetPropertiesByUserIdQuery } from "features/Api/propertiesApi";
import ChatForm from "features/Raspy/ChatForm";

export default function RaspyDialog({ raspyOpen, setRaspyOpen }) {
  const user = fetchLoggedInUser();
  const { data: properties = [], isLoading: isPropertiesListLoading } =
    useGetPropertiesByUserIdQuery(user.uid, {
      skip: !user?.uid,
    });

  if (isPropertiesListLoading) {
    setLoadingText(RecapTextEnumValues.Loading);
    return <Skeleton height="10rem" />;
  }

  return (
    <Dialog
      open={raspyOpen}
      keepMounted
      fullWidth
      maxWidth="md"
      aria-describedby="ai-property-recap-dialog"
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1}>
            <AutoAwesomeRounded color="primary" />
            <Typography
              textAlign="center"
              variant="body1"
              sx={{
                color: "#999",
                fontWeight: 300,
              }}
              color="text.primary"
            >
              Raspy Assistant ...
            </Typography>
          </Stack>
          <Box alignSelf="flex-end">
            <IconButton size="small" onClick={() => setRaspyOpen(false)}>
              <CloseRounded fontSize="small" />
            </IconButton>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <ChatForm properties={properties} tenants={[]} />
      </DialogContent>
      <DialogActions>
        <AButton
          label="Later"
          variant="outlined"
          size="small"
          onClick={() => setRaspyOpen(false)}
        />
      </DialogActions>
    </Dialog>
  );
}
