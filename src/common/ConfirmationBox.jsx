import React from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import AButton from "common/AButton";

// DefaultConfirmationBoxProps ...
// default confirmation box props
export const DefaultConfirmationBoxProps = {
  value: false,
  updateKey: null,
};

export default function ConfirmationBox({
  isOpen,
  isBlocked = false,
  isLoading = false,
  handleCancel,
  handleConfirm,
  title = "Confirm Delete",
  captionText = "Are you sure you want to proceed with this action?",
  children,
}) {
  return (
    <Dialog
      open={isOpen}
      keepMounted
      fullWidth
      maxWidth="xs"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{captionText}</DialogContentText>
        <Stack>{children}</Stack>
      </DialogContent>
      <DialogActions>
        <AButton
          label="Confirm"
          loading={isLoading}
          disabled={isBlocked}
          onClick={handleConfirm}
        />
        <AButton label="Cancel" variant="outlined" onClick={handleCancel} />
      </DialogActions>
    </Dialog>
  );
}
