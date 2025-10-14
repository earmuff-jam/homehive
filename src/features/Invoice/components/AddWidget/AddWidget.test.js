import React from "react";

import AddWidget from "./AddWidget";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("features/Invoice/constants", () => ({
  WidgetTypeList: [
    { id: "chart", label: "Chart", config: {} },
    { id: "summary", label: "Summary", config: {} },
  ],
}));

describe("AddWidget Component", () => {
  describe("AddWidget Component snapshot tests", () => {
    test("Footer matches snapshot", () => {
      const { asFragment } = render(<AddWidget />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("AddWidget Component tests", () => {
    it("renders the title and widget list", () => {
      render(<AddWidget handleAddWidget={jest.fn()} />);

      expect(screen.getByText("Add Widget")).toBeInTheDocument();

      expect(screen.getByText("Chart")).toBeInTheDocument();
      expect(screen.getByText("Summary")).toBeInTheDocument();
    });

    it("calls handleAddWidget with correct id on click", () => {
      const handleAddWidget = jest.fn();
      render(<AddWidget handleAddWidget={handleAddWidget} />);

      fireEvent.click(screen.getByText("Chart"));

      expect(handleAddWidget).toHaveBeenCalledTimes(1);
      expect(handleAddWidget).toHaveBeenCalledWith("chart");
    });
  });
});
