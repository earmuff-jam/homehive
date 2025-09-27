import React, { useState } from "react";

import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Stack, Typography } from "@mui/material";
import Widget from "features/InvoiceWorks/components/Dashboard/Widget";
import WidgetProps from "features/InvoiceWorks/components/Dashboard/WidgetProps";

export default function DndGridLayout({
  editMode,
  widgets,
  setWidgets,
  handleRemoveWidget,
}) {
  const [activeWidget, setActiveWidget] = useState(null); // active widget for drag overlay

  const handleDragStart = (ev) => {
    const { active } = ev;
    const activeId = active.id.toString();
    const widget = widgets.find((w) => w.widgetID === activeId);
    setActiveWidget(widget);
  };

  const handleDragEnd = (ev) => {
    const { active, over } = ev; // active is current, over is replacing

    setActiveWidget(null);

    if (!over) return;
    if (active.id === over.id) return;

    const originalIdx = widgets.findIndex(
      (widget) => widget.widgetID === active.id.toString(),
    );
    const newIdx = widgets.findIndex(
      (widget) => widget.widgetID === over.id.toString(),
    );

    const updatedWidgets = arrayMove(widgets, originalIdx, newIdx);

    setWidgets(updatedWidgets);
    localStorage.setItem("widgets", JSON.stringify(updatedWidgets));
  };

  if (widgets.length <= 0)
    return (
      <Stack textAlign="center">
        <Typography variant="h5">Sorry, no matching records found</Typography>
        <Typography variant="caption">
          Add widgets for custom dashboard layout.
        </Typography>
      </Stack>
    );

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={widgets.map((w) => w.widgetID)}
        strategy={rectSortingStrategy}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            margin: "1rem 0rem",
          }}
        >
          {widgets.map((widget) => {
            const isDragging = activeWidget?.widgetID === widget.widgetID;
            return (
              <Box key={widget.widgetID}>
                {isDragging ? (
                  <Box
                    sx={{
                      width: activeWidget?.config?.width,
                      height: activeWidget?.config?.height,
                      backgroundColor: "slategrey",
                    }}
                  />
                ) : (
                  <Widget
                    widget={widget}
                    editMode={editMode}
                    handleRemoveWidget={handleRemoveWidget}
                  >
                    {WidgetProps(widget)}
                  </Widget>
                )}
              </Box>
            );
          })}
        </Stack>
      </SortableContext>
      <DragOverlay>
        {activeWidget ? (
          <Widget widget={activeWidget} handleRemoveWidget={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
