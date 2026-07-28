import React from "react";

import PropertyStatistics from "./PropertyStatistics";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/utils", () => ({
  formatCurrency: vi.fn((v) => `$${v}`),
  getOccupancyRate: vi.fn(() => 75),
}));

vi.mock("features/Rent/hooks/useGetSelectedPropertyDetails", () => ({
  __esModule: true,
  useSelectedPropertyDetails: vi.fn(() => ({
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
      const { container } = render(
        <PropertyStatistics
          isPropertyLoading
          property={mockProperty}
          tenants={mockTenants}
        />,
      );

      expect(screen.queryByText("Total Units")).not.toBeInTheDocument();
      expect(screen.queryByText("Monthly Revenue")).not.toBeInTheDocument();

      expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
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
      expect(screen.getByText("Unit(s) occupied")).toBeInTheDocument();
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
      expect(screen.getByText("Home Occupied")).toBeInTheDocument();
    });
  });
});
