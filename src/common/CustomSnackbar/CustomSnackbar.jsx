import React from "react";

import { Alert, Snackbar, Typography } from "@mui/material";

function CustomSnackbar({
  showSnackbar,
  setShowSnackbar,
  severity = "success",
  title,
  caption,
  onClick,
}) {
  return (
    <Snackbar
      open={showSnackbar}
      autoHideDuration={3000}
      onClose={() => setShowSnackbar(false)}
    >
      <Alert
        onClose={() => setShowSnackbar(false)}
        severity={severity}
        variant="filled"
      >
        <Typography variant="caption" textTransform="initial">
          {title}
        </Typography>
        <Typography
          variant="caption"
          textTransform="initial"
          paddingLeft="0.2rem"
          sx={{ cursor: "pointer", textDecoration: 'underline' }}
          onClick={(e) => {
            // prevent bubbling to parent, so that snackbar does not navigate
            // if close button is pressed
            e.stopPropagation();
            onClick?.();
          }}
        >
          {caption}
        </Typography>
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
