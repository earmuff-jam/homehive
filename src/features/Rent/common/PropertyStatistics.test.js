import React from "react";

import PropertyStatistics from "./PropertyStatistics";
import { render, screen } from "@testing-library/react";

jest.mock("features/Rent/utils", () => ({
  formatCurrency: jest.fn((v) => `$${v}`),
  getOccupancyRate: jest.fn(() => 75),
}));

jest.mock("features/Rent/hooks/useGetSelectedPropertyDetails", () => ({
  __esModule: true,
  useSelectedPropertyDetails: jest.fn(() => ({
    totalRent: "2500",
    getOccupancyRate: 75,
    nextPaymentDueDate: "Feb 01, 2024",
    isSelectedPropertySoR: false,
  })),
}));

const mockProperty = {
  units: 4,
};
const mockTenants = [{ id: 1 }, { id: 2 }];

describe("PropertyStatistics Jest tests", () => {
  describe("PropertyStatistics Snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <PropertyStatistics
          isPropertyLoading
          property={mockProperty}
          tenants={mockTenants}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("PropertyStatistics Component Tests", () => {
    it("renders skeletons when property is loading", () => {
      render(
        <PropertyStatistics
          isPropertyLoading
          property={mockProperty}
          tenants={mockTenants}
        />,
      );

      expect(screen.queryByText("Total Units")).not.toBeInTheDocument();
      expect(screen.queryByText("Monthly Revenue")).not.toBeInTheDocument();
    });

    it("renders property statistics when loaded", () => {
      render(
        <PropertyStatistics
          isPropertyLoading={false}
          property={mockProperty}
          tenants={mockTenants}
          isAnyTenantSoR
        />,
      );

      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("Total Units")).toBeInTheDocument();
      expect(screen.getByText("Occupied Units")).toBeInTheDocument();
      expect(screen.getByText("75%")).toBeInTheDocument();
      expect(screen.getByText("$2500")).toBeInTheDocument();
      expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
    });

    it("shows home-based labels when not SoR", () => {
      render(
        <PropertyStatistics
          isPropertyLoading={false}
          property={mockProperty}
          tenants={mockTenants}
          isAnyTenantSoR={false}
        />,
      );

      expect(screen.getByText("Total Bedrooms")).toBeInTheDocument();
      expect(screen.getByText("Occupied Home")).toBeInTheDocument();
    });
  });
});
