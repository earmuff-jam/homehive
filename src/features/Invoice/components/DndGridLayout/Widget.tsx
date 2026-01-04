import { ReactNode } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CancelRounded, DragIndicatorRounded } from "@mui/icons-material";
import { Badge, Box, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import AIconButton from "common/AIconButton";
import { TWidget } from "features/Invoice/types/Invoice.types";

// WidgetProps ...
type WidgetProps = {
  editMode: boolean;
  widget: TWidget;
  handleRemoveWidget: (widgetID: string) => void;
  children: ReactNode;
};

// CustomTransitionStyle ...
type CustomTransitionStyle = {
  transition: string;
  transform: string;
};

export default function Widget({
  editMode,
  widget,
  handleRemoveWidget,
  children,
}: WidgetProps) {
  const { widgetId, inset, ...config } = widget.config; // eslint-disable-line no-unused-vars
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: widget.widgetID,
    });

  const style: CustomTransitionStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Box sx={{ ...style }} ref={setNodeRef}>
      <Badge
        badgeContent={
          editMode && (
            <AIconButton
              size="small"
              color="error"
              disableRipple
              disableFocusRipple
              disableTouchRipple
              onClick={() => handleRemoveWidget(widget?.widgetID || "")}
              label={<CancelRounded fontSize="small" />}
            />
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
                <AIconButton
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
                  label={<DragIndicatorRounded fontSize="inherit" />}
                />
              </Tooltip>
            )}
            {children}
          </Stack>
        </Box>
      </Badge>
    </Box>
  );
}
