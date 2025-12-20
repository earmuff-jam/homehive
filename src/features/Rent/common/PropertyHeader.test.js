import React from "react";

import PropertyHeader from "./PropertyHeader";
import { render, screen } from "@testing-library/react";

describe("PropertyHeader Jest tests", () => {
  describe("PropertyHeader snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const mockProperty = {
        name: "Sunset Villa",
        address: "123 Main St",
        city: "Austin",
        state: "TX",
        zipcode: "78701",
      };

      const { asFragment } = render(<PropertyHeader property={mockProperty} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("PropertyHeader Component tests", () => {
    const mockProperty = {
      name: "Sunset Villa",
      address: "123 Main St",
      city: "Austin",
      state: "TX",
      zipcode: "78701",
    };

    it("renders property name and address", () => {
      render(<PropertyHeader property={mockProperty} />);

      expect(screen.getByText("Sunset Villa")).toBeInTheDocument();
      expect(
        screen.getByText(/123 Main St, Austin, TX 78701/i),
      ).toBeInTheDocument();
    });

    it("does not render renter chip when isRentee is false", () => {
      render(<PropertyHeader property={mockProperty} />);

      expect(screen.queryByText(/renter/i)).not.toBeInTheDocument();
    });

    it("renders Primary Renter chip when isRentee and isPrimaryRenter are true", () => {
      render(
        <PropertyHeader property={mockProperty} isRentee isPrimaryRenter />,
      );

      expect(screen.getByText("Primary Renter")).toBeInTheDocument();
    });

    it("renders Secondary Renter chip when isRentee is true and isPrimaryRenter is false", () => {
      render(
        <PropertyHeader
          property={mockProperty}
          isRentee
          isPrimaryRenter={false}
        />,
      );

      expect(screen.getByText("Secondary Renter")).toBeInTheDocument();
    });
  });
});
