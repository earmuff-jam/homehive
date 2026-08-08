import React, { useState } from "react";

import { InfoRounded } from "@mui/icons-material";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";

// DefaultDialog ...
const DefaultDialog = {
  title: "",
  label: "",
  type: "",
  showWatermark: true,
  display: false,
};

// withDialog ...
// HOC component used to render dialog for print
const withDialog = (WrappedComponent) => {
  const WithDialog = (props) => {
    const [dialog, setDialog] = useState(DefaultDialog);

    const closeDialog = () => setDialog(DefaultDialog);

    const handleChange = () => {
      setDialog((prev) => ({
        ...prev,
        showWatermark: !prev.showWatermark,
      }));
    };

    return (
      <>
        <WrappedComponent {...props} setDialog={setDialog} />
        <Dialog
          keepMounted
          className="no-print"
          open={dialog.type === "PRINT"}
          onClose={closeDialog}
          aria-describedby="alert-dialog-print-confirmation-box"
        >
          <DialogTitle variant="h5" color="text.secondary">
            {dialog.label}
          </DialogTitle>

          <DialogContent>
            <Typography variant="subtitle2" color="text.secondary">
              {dialog.title}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <FormControlLabel
                label="Display watermark"
                labelPlacement="end"
                control={
                  <Checkbox
                    checked={dialog.showWatermark}
                    onChange={handleChange}
                  />
                }
              />

              <Tooltip title="Displays invoice status while printing the invoice.">
                <InfoRounded
                  sx={{
                    color: "text.secondary",
                    width: 16,
                    height: 16,
                  }}
                />
              </Tooltip>
            </Stack>
          </DialogContent>

          <DialogActions>
            <AButton
              onClick={() => {
                closeDialog();
                window.print();
              }}
              className="no-print"
              label="Print"
            />

            <AButton
              size="small"
              variant="outlined"
              onClick={closeDialog}
              className="no-print"
              label="Cancel"
            />
          </DialogActions>
        </Dialog>
      </>
    );
  };

  WithDialog.displayName = `withDialog(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithDialog;
};

export default withDialog;
