import React from "react";

import { Provider } from "react-redux";

import Widget from "./Widget";
import { fireEvent, render, screen } from "@testing-library/react";
import { store } from "src/store";
import { describe, expect, it, vi } from "vitest";

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
  }),
}));

describe("Widget", () => {
  it("renders widget details and handles edit and remove actions", () => {
    const handleEditMode = vi.fn();
    const handleRemoveWidget = vi.fn();

    const widget = {
      widgetID: "widget-1",
      title: "Water Repair",
      caption: "Plumbing and cleanup Cost",
      type: "timeline-chart",
      config: {
        width: 400,
        height: 300,
      },
      data: [],
    };

    render(
      <Provider store={store}>
        <Widget
          widget={widget}
          handleEditMode={handleEditMode}
          handleRemoveWidget={handleRemoveWidget}
        />
        ,
      </Provider>,
    );

    expect(screen.getByText("Water Repair")).toBeInTheDocument();
    expect(screen.getByText("Plumbing and cleanup Cost")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[1]);

    expect(handleEditMode).toHaveBeenCalledTimes(1);
    expect(handleEditMode).toHaveBeenCalledWith("widget-1");

    fireEvent.click(buttons[2]);

    expect(handleRemoveWidget).toHaveBeenCalledTimes(1);
    expect(handleRemoveWidget).toHaveBeenCalledWith("widget-1");
  });
});
