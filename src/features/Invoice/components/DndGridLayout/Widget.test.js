import React from "react";

import Widget from "./Widget";
import { render, screen } from "@testing-library/react";

describe("Widget", () => {
  const mockHandleRemoveWidget = jest.fn();

  const widget = {
    widgetID: "1",
    config: {
      width: 200,
      height: 100,
    },
  };

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <Widget
        editMode={false}
        widget={widget}
        handleRemoveWidget={mockHandleRemoveWidget}
      >
        <div>Child Content</div>
      </Widget>,
    );

    expect(screen.getByText(/Child Content/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows edit icons when in edit mode", () => {
    const { asFragment } = render(
      <Widget
        editMode={true}
        widget={widget}
        handleRemoveWidget={mockHandleRemoveWidget}
      >
        <div>Child Content</div>
      </Widget>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
