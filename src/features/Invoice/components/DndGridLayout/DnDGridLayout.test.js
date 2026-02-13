import React from "react";

import DndGridLayout from "./DndGridLayout";
import { render, screen } from "@testing-library/react";

describe("DndGridLayout", () => {
  const mockSetWidgets = jest.fn();
  const mockHandleRemoveWidget = jest.fn();

  it("renders empty state when no widgets exist", () => {
    const { asFragment } = render(
      <DndGridLayout
        editMode={false}
        widgets={[]}
        setWidgets={mockSetWidgets}
        handleRemoveWidget={mockHandleRemoveWidget}
      />,
    );

    expect(
      screen.getByText(/Sorry, no matching records found/i),
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders widget layout when widgets exist", () => {
    const widgets = [
      {
        widgetID: "1",
        id: "1",
        label: "Test Widget",
        config: { width: 200, height: 100 },
      },
    ];

    const { asFragment } = render(
      <DndGridLayout
        editMode={false}
        widgets={widgets}
        setWidgets={mockSetWidgets}
        handleRemoveWidget={mockHandleRemoveWidget}
      />,
    );

    // snapshot to capture structure
    expect(asFragment()).toMatchSnapshot();
  });
});
