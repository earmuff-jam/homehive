import React from "react";

import { CancelRounded, EditRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import AIconButton from "common/AIconButton";

export default function WidgetHeader({
  label,
  caption,
  widgetID,
  handleRemoveWidget,
  handleEditMode,
}) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack>
        <Typography variant="h5" color="primary">
          {label}
        </Typography>
        <Typography variant="caption">{caption}</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <AIconButton
          size="small"
          disableRipple
          disableFocusRipple
          disableTouchRipple
          onClick={() => handleEditMode(widgetID)}
          label={<EditRounded fontSize="small" />}
        />
        <AIconButton
          size="small"
          color="error"
          disableRipple
          disableFocusRipple
          disableTouchRipple
          onClick={() => handleRemoveWidget(widgetID)}
          label={<CancelRounded fontSize="small" />}
        />
      </Stack>
    </Stack>
  );
}
