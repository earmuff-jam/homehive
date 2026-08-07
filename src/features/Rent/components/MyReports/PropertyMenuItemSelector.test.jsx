import React from "react";

import PropertyMenuItemSelector from "./PropertyMenuItemSelector";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("PropertyMenuItemSelector", () => {
  describe("SelectedProperty Snapshot tests", () => {
    const mockData = [
      {
        id: "property-1",
        name: "Property One",
      },
      {
        id: "property-2",
        name: "Property Two",
      },
    ];

    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <PropertyMenuItemSelector
          inputLabel="Select Property"
          selectedItem=""
          onChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("SelectedProperty Component tests", () => {
    const mockData = [
      {
        id: "property-1",
        name: "Property One",
      },
      {
        id: "property-2",
        name: "Property Two",
      },
    ];

    it("renders the input label", () => {
      render(
        <PropertyMenuItemSelector
          inputLabel="Select Property"
          selectedItem=""
          onChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Select Property")).toBeInTheDocument();
    });

    it("renders all menu items", () => {
      render(
        <PropertyMenuItemSelector
          inputLabel="Select Property"
          selectedItem=""
          onChange={vi.fn()}
          data={mockData}
        />,
      );

      // Open the MUI Select dropdown
      fireEvent.mouseDown(screen.getByRole("combobox"));

      expect(screen.getByText("Property One")).toBeInTheDocument();
      expect(screen.getByText("Property Two")).toBeInTheDocument();
    });

    it("calls onChange when a property is selected", () => {
      const handleChange = vi.fn();

      render(
        <PropertyMenuItemSelector
          inputLabel="Select Property"
          selectedItem=""
          onChange={handleChange}
          data={mockData}
        />,
      );

      fireEvent.mouseDown(screen.getByRole("combobox"));

      fireEvent.click(screen.getByText("Property Two"));

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("shows the selected value", () => {
      render(
        <PropertyMenuItemSelector
          inputLabel="Select Property"
          selectedItem="property-1"
          onChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByRole("combobox")).toHaveTextContent("Property One");
    });

    it("renders without data", () => {
      render(
        <PropertyMenuItemSelector
          inputLabel="Select Property"
          selectedItem=""
          onChange={vi.fn()}
          data={[]}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
