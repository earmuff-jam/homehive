import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CancelRounded,
  DragIndicatorRounded,
  EditRounded,
  FilterListRounded,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AIconButton from "common/AIconButton";
import WidgetContent from "features/Invoice/components/DndGridLayout/WidgetContent";
import WidgetFilters from "features/Invoice/components/DndGridLayout/WidgetFilters";

export default function Widget({
  widget = {},
  handleEditMode,
  handleRemoveWidget,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: widget.widgetID,
    });

  const handleClose = () => setAnchorEl(null);
  const handleClick = (ev) => setAnchorEl(ev.currentTarget);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box sx={{ ...style }} ref={setNodeRef}>
      <Box
        component={Paper}
        {...widget.config}
        sx={{
          padding: 1,
          overflow: "auto",
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
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
            <Stack>
              <Typography variant="h6" color="primary">
                {widget?.title}
              </Typography>
              <Typography variant="caption">{widget?.caption}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1}>
            {widget?.filters?.invoiceIDs?.length > 0 && (
              <AIconButton
                size="small"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                onClick={handleClick}
                label={
                  <Badge
                    color="info"
                    badgeContent={widget?.filters?.invoiceIDs?.length || 0}
                  >
                    <FilterListRounded fontSize="small" />
                  </Badge>
                }
              />
            )}

            <AIconButton
              size="small"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              onClick={() => handleEditMode(widget?.widgetID)}
              label={<EditRounded fontSize="small" />}
            />
            <AIconButton
              size="small"
              color="error"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              onClick={() => handleRemoveWidget(widget?.widgetID)}
              label={<CancelRounded fontSize="small" />}
            />
          </Stack>
        </Stack>
        <WidgetContent widget={widget} />
      </Box>
      <Popover
        id={open ? "simple-popover" : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              width: "15rem",
            },
          },
        }}
      >
        <WidgetFilters filters={widget?.filters} />
      </Popover>
    </Box>
  );
}
