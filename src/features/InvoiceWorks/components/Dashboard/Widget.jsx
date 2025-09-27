import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CancelRounded, DragIndicatorRounded } from "@mui/icons-material";
import { Badge, Box, IconButton, Paper, Stack, Tooltip } from "@mui/material";

export default function Widget({
  editMode,
  widget = {},
  handleRemoveWidget,
  children,
}) {
  const { widgetID, inset, ...config } = widget.config; // eslint-disable-line no-unused-vars
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: widget.widgetID,
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box sx={{ ...style }} ref={setNodeRef}>
      <Badge
        badgeContent={
          editMode && (
            <IconButton
              size="small"
              color="error"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              onClick={() => handleRemoveWidget(widget?.widgetID || "")}
            >
              <CancelRounded fontSize="small" />
            </IconButton>
          )
        }
      >
        <Box
          component={Paper}
          {...config}
          sx={{
            padding: 1,
            overflow: "auto",
            backgroundColor: "background.paper",
          }}
        >
          <Stack direction="row" spacing={1}>
            {editMode && (
              <Tooltip title="Drag and drop to restructure widget layout">
                <IconButton
                  size="small"
                  {...attributes}
                  {...listeners}
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                  color="primary"
                  sx={{
                    cursor: "move",
                    alignSelf: "flex-start", // put icon to the top of the widget container
                    paddingTop: "1rem",
                  }}
                >
                  <DragIndicatorRounded fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
            {children}
          </Stack>
        </Box>
      </Badge>
    </Box>
  );
}
