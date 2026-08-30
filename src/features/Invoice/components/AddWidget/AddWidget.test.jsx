import React from "react";

import AddWidget from "./AddWidget";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, test, vi } from "vitest";

describe("AddWidget Component", () => {
  describe("AddWidget Component snapshot tests", () => {
    test("Footer matches snapshot", () => {
      const { asFragment } = render(<AddWidget />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("AddWidget Component tests", () => {
    it("renders the title and widget list", () => {
      render(<AddWidget handleAddWidget={vi.fn()} />);

      expect(screen.getByText("Add Widget")).toBeInTheDocument();

      expect(screen.getByText("Timeline Chart")).toBeInTheDocument();
      expect(screen.getByText("Collected tax and totals")).toBeInTheDocument();
      expect(screen.getByText("Items / Service Type")).toBeInTheDocument();
      expect(screen.getByText("Item Details Table")).toBeInTheDocument();
    });

    it("calls handleAddWidget with the selected widget type", () => {
      const handleAddWidget = vi.fn();

      render(<AddWidget handleAddWidget={handleAddWidget} />);

      fireEvent.click(screen.getByText("Timeline Chart"));

      expect(handleAddWidget).toHaveBeenCalledTimes(1);
      expect(handleAddWidget).toHaveBeenCalledWith("timeline-chart");

      fireEvent.click(screen.getByText("Collected tax and totals"));

      expect(handleAddWidget).toHaveBeenCalledTimes(2);
      expect(handleAddWidget).toHaveBeenCalledWith("tax-chart");

      fireEvent.click(screen.getByText("Items / Service Type"));

      expect(handleAddWidget).toHaveBeenCalledTimes(3);
      expect(handleAddWidget).toHaveBeenCalledWith("service-chart");

      fireEvent.click(screen.getByText("Item Details Table"));

      expect(handleAddWidget).toHaveBeenCalledTimes(4);
      expect(handleAddWidget).toHaveBeenCalledWith("details-table");
    });
  });
});
