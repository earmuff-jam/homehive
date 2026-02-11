import React from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  handleCancel,
  handleConfirm,
}) {
  return (
    <Dialog
      open={isOpen}
      keepMounted
      fullWidth
      maxWidth="xs"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Confirm delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to proceed with this action?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <AButton label="Confirm" onClick={handleConfirm} />
        <AButton label="Cancel" variant="outlined" onClick={handleCancel} />
      </DialogActions>
    </Dialog>
  );
}
