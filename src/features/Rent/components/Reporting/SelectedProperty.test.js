import React from "react";

import SelectProperty from "./SelectProperty";
import { fireEvent, render, screen } from "@testing-library/react";

describe("SelectProperty", () => {
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
        <SelectProperty
          inputLabel="Select Property"
          selectedItem=""
          onChange={jest.fn()}
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
        <SelectProperty
          inputLabel="Select Property"
          selectedItem=""
          onChange={jest.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Select Property")).toBeInTheDocument();
    });

    it("renders all menu items", () => {
      render(
        <SelectProperty
          inputLabel="Select Property"
          selectedItem=""
          onChange={jest.fn()}
          data={mockData}
        />,
      );

      // Open the MUI Select dropdown
      fireEvent.mouseDown(screen.getByRole("combobox"));

      expect(screen.getByText("Property One")).toBeInTheDocument();
      expect(screen.getByText("Property Two")).toBeInTheDocument();
    });

    it("calls onChange when a property is selected", () => {
      const handleChange = jest.fn();

      render(
        <SelectProperty
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
        <SelectProperty
          inputLabel="Select Property"
          selectedItem="property-1"
          onChange={jest.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByRole("combobox")).toHaveTextContent("Property One");
    });

    it("renders without data", () => {
      render(
        <SelectProperty
          inputLabel="Select Property"
          selectedItem=""
          onChange={jest.fn()}
          data={[]}
        />,
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
