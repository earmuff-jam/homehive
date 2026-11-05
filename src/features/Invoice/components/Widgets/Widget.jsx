import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CancelRounded,
  ChevronRightRounded,
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
import WidgetContent from "features/Invoice/components/Widgets/WidgetContent";
import WidgetFilters from "features/Invoice/components/Widgets/WidgetFilters";
import { getActiveFilters } from "features/Invoice/utils/getActiveFilters";

export default function Widget({
  widget = {},
  handleEditMode,
  handleRemoveWidget,
  handleResizeWidget,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: widget.widgetID,
    });

  const widgetFilters = getActiveFilters(widget?.filters);

  const handleClose = () => setAnchorEl(null);
  const handleClick = (ev) => setAnchorEl(ev.currentTarget);

  const handleResizeStart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;

    const widgetElement = event.currentTarget.parentElement;
    const startWidth = widgetElement.offsetWidth;
    const startHeight = widgetElement.offsetHeight;

    const handleMouseMove = (moveEvent) => {
      const width = Math.max(200, startWidth + (moveEvent.clientX - startX));
      const height = Math.max(150, startHeight + (moveEvent.clientY - startY));

      handleResizeWidget?.(widget.widgetID, {
        width,
        height,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        ...style,
        position: "relative",
      }}
    >
      <Box
        component={Paper}
        sx={{
          padding: 1,
          overflow: "auto",
          width: widget?.config?.width,
          height: widget?.config?.height,
          minWidth: widget.config.minWidth,
          minHeight: widget.config.minHeight,
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
                  paddingTop: "1rem",
                  alignSelf: "flex-start",
                }}
              >
                <DragIndicatorRounded fontSize="small" />
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
            {widgetFilters?.length > 0 && (
              <AIconButton
                size="small"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                onClick={handleClick}
                label={
                  <Badge color="info" badgeContent={widgetFilters?.length || 0}>
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
      <Box
        onMouseDown={handleResizeStart}
        sx={{
          position: "absolute",
          right: -10,
          bottom: -10,
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        <ChevronRightRounded
          fontSize="large"
          sx={{
            transform: "rotate(45deg)",
            cursor: "nwse-resize",
          }}
        />
      </Box>

      <Popover
        id={anchorEl ? "simple-popover" : undefined}
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
