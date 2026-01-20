import { useState } from "react";

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { TWidget } from "features/Invoice/Invoice.schema";
import Widget from "features/Invoice/components/DndGridLayout/Widget";
import WidgetProps from "features/Invoice/components/DndGridLayout/WidgetProps";

// DndGridLayoutProps ...
export type DndGridLayoutProps = {
  editMode: boolean;
  widgets: TWidget[];
  setWidgets: (widgets: TWidget[]) => void;
  handleRemoveWidget: (id: number) => void;
};

export default function DndGridLayout({
  editMode,
  widgets,
  setWidgets,
  handleRemoveWidget,
}: DndGridLayoutProps) {
  const [activeWidget, setActiveWidget] = useState<TWidget | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const widget = widgets.find(
      (w) => w.widgetID.toString() === active.id.toString(),
    );
    setActiveWidget(widget ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveWidget(null);

    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = widgets.findIndex(
      (w) => w.widgetID.toString() === active.id.toString(),
    );
    const newIndex = widgets.findIndex(
      (w) => w.widgetID.toString() === over.id.toString(),
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedWidgets = arrayMove(widgets, oldIndex, newIndex);

    setWidgets(updatedWidgets);
    localStorage.setItem("widgets", JSON.stringify(updatedWidgets));
  };

  if (widgets.length === 0)
    return (
      <EmptyComponent caption="Add widgets for custom dashboard layout." />
    );

  return (
    <DndContext
      sensors={sensors}
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
                      width: widget.config?.width,
                      height: widget.config?.height,
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
          <Widget
            widget={activeWidget}
            editMode={editMode}
            handleRemoveWidget={() => {}}
          >
            {WidgetProps(activeWidget)}
          </Widget>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
