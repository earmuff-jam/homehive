import React, { useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Box, Stack, useTheme } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import Widget from "features/Invoice/components/DndGridLayout/Widget";

export default function DndGridLayout({
  handleWidgetMove,
  handleEditMode,
  handleRemoveWidget,
}) {
  const theme = useTheme();

  const { control } = useFormContext();

  const widgets = useWatch({
    control,
    name: "widgets",
  });

  const [activeWidget, setActiveWidget] = useState(null); // active widget for drag overlay

  const handleDragStart = (ev) => {
    const { active } = ev;
    const activeId = active.id.toString();
    const widget = widgets.find((w) => w.widgetID === activeId);
    setActiveWidget(widget);
  };

  const handleDragEnd = (ev) => {
    const { active, over } = ev;

    setActiveWidget(null);

    if (!over || active.id === over.id) return;

    const originalIdx = widgets.findIndex(
      (widget) => widget.widgetID === active.id.toString(),
    );

    const newIdx = widgets.findIndex(
      (widget) => widget.widgetID === over.id.toString(),
    );

    if (originalIdx === -1 || newIdx === -1) return;

    handleWidgetMove(originalIdx, newIdx);
  };

  if (widgets?.length <= 0)
    return <EmptyComponent caption="Add widgets for custom dashboard layout" />;

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
                      backgroundColor: theme.palette.primary.lightBackground,
                    }}
                  />
                ) : (
                  <Widget
                    widget={widget}
                    handleEditMode={handleEditMode}
                    handleRemoveWidget={handleRemoveWidget}
                  />
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
