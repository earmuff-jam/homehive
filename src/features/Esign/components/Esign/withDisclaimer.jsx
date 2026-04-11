import React, { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";

const withDisclaimer = (WrappedComponent) => {
  return function DisclaimerComponent(props) {
    const [checked, setChecked] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(true);

    const handleAcknowledge = () => setDisplayDialog(false);
    const handleChange = (event) => setChecked(event.target.checked);

    return (
      <>
        <Dialog
          open={displayDialog}
          maxWidth="md"
          fullWidth
          disableEscapeKeyDown
        >
          <DialogTitle>Platform Disclaimer</DialogTitle>

          <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Landlord–tenant laws may vary by city, state, and property type.
              This platform provides document automation tools, not legal
              services.
            </Alert>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2">
                The property owner, manager, or broker is solely responsible for
                ensuring that any documents created, signed, or distributed
                through this platform comply with all applicable federal, state,
                and local laws, including landlord–tenant regulations, housing
                rules, and property codes.
              </Typography>

              <Typography variant="body2">
                This platform provides document automation and electronic
                signature technology only. It does not provide legal advice,
                legal services, or legal representation.
              </Typography>

              <Typography variant="body2">
                Documents and templates available through this platform are
                provided for general informational purposes and may not be
                suitable for every situation or jurisdiction. Laws vary
                significantly by location and circumstances.
              </Typography>

              <Typography variant="body2">
                Users are strongly encouraged to consult a qualified attorney or
                legal professional to review any documents before sending,
                signing, or relying on them.
              </Typography>

              <Typography variant="body2">
                By using this platform, you acknowledge that you are fully
                responsible for reviewing, approving, and ensuring the legality
                and enforceability of any document you create, upload, send, or
                sign through the service.
              </Typography>

              <Typography variant="body2">
                The platform and its operators disclaim any liability for
                damages, losses, disputes, claims, or legal consequences arising
                from the use of documents, templates, or electronic signatures
                generated through this service.
              </Typography>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  I have read and understood the privacy policy stated above.
                </Typography>
                <FormControlLabel
                  required
                  label={
                    <Typography variant="caption">
                      I agree with the privacy policy stated above
                    </Typography>
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={handleChange}
                    />
                  }
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ mt: 1, fontStyle: "italic", fontWeight: "bold" }}
              >
                By clicking &quot;I Understand&quot;, you confirm that you have read and
                agree to this disclaimer.
              </Typography>
            </Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                disabled={!checked}
                onClick={handleAcknowledge}
              >
                I Understand
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withDisclaimer;
