import React from "react";

import PropertyStatistics from "./PropertyStatistics";
import { render, screen } from "@testing-library/react";
import { useGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/hooks/useGetSelectedPropertyDetails", () => ({
  useSelectedPropertyDetails: vi.fn(),
}));

vi.mock("features/Api/maintenanceApi", () => ({
  useGetMaintenanceRecordsQuery: vi.fn(),
}));

const property = {
  id: "4f16b264-720b-44bb-a571-f3bd84b5c45a",
  name: "Property at the Great Hills Trails",
};

describe("PropertyStatistics", () => {
  describe("PropertyStatistics Snapshot tests", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();

      vi.mocked(useSelectedPropertyDetails).mockReturnValue({
        totalRent: 2000,
      });

      vi.mocked(useGetMaintenanceRecordsQuery).mockReturnValue({
        data: [],
        isFetching: false,
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("renders correctly and matches snapshot", () => {
      vi.setSystemTime(new Date("2026-08-13"));

      const { asFragment } = render(
        <PropertyStatistics
          properties={[property]}
          selected="property-1"
          existingTenants={[]}
          existingRents={[]}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("PropertyStatistics component tests", () => {
    describe("should render property statistics", () => {
      beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useSelectedPropertyDetails).mockReturnValue({
          totalRent: 2000,
        });

        vi.mocked(useGetMaintenanceRecordsQuery).mockReturnValue({
          data: [],
          isFetching: false,
        });
      });

      it("renders empty component when there are no properties", () => {
        render(<PropertyStatistics properties={[]} />);

        expect(
          screen.getByText("Add properties to view statistics"),
        ).toBeInTheDocument();
      });
      it("renders empty component when no property is selected", () => {
        render(
          <PropertyStatistics
            properties={[property]}
            selected=""
            existingTenants={[]}
            existingRents={[]}
          />,
        );

        expect(
          screen.getByText("Select a property to view statistics"),
        ).toBeInTheDocument();
      });
      it("renders all accordions when a property is selected", () => {
        render(
          <PropertyStatistics
            properties={[property]}
            selected="property-1"
            existingTenants={[]}
            existingRents={[]}
          />,
        );

        expect(screen.getByText("Vacancy & Occupancy")).toBeInTheDocument();
        expect(screen.getByText("Lease Health")).toBeInTheDocument();
        expect(screen.getByText("Rent Collection")).toBeInTheDocument();
        expect(screen.getByText("Maintenance")).toBeInTheDocument();
        expect(screen.getByText("Top Maintenance Issues")).toBeInTheDocument();
      });
      it("renders maintenance category counts", () => {
        vi.mocked(useGetMaintenanceRecordsQuery).mockReturnValue({
          data: [
            {
              propertyId: "property-1",
              maintenanceCategory: "Electrical",
            },
            {
              propertyId: "property-1",
              maintenanceCategory: "Electrical",
            },
            {
              propertyId: "property-1",
              maintenanceCategory: "Plumbing",
            },
            {
              propertyId: "property-2",
              maintenanceCategory: "Electrical",
            },
          ],
          isFetching: false,
        });

        render(
          <PropertyStatistics
            properties={[property]}
            selected="property-1"
            existingTenants={[]}
            existingRents={[]}
          />,
        );

        expect(screen.getByText("Electrical")).toBeInTheDocument();
        expect(screen.getByText("Plumbing")).toBeInTheDocument();

        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
      });
      it("passes the selected property to the maintenance query", () => {
        render(
          <PropertyStatistics properties={[property]} selected="property-1" />,
        );

        expect(useGetMaintenanceRecordsQuery).toHaveBeenCalledWith(
          { propertyId: "property-1" },
          { skip: false },
        );
      });
    });
    describe("should skip the maintenance query when property is not selected", () => {
      beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useSelectedPropertyDetails).mockReturnValue({
          totalRent: 2000,
        });

        vi.mocked(useGetMaintenanceRecordsQuery).mockReturnValue({
          data: [],
          isFetching: false,
        });
      });

      it("skips the maintenance query when nothing is selected", () => {
        render(
          <PropertyStatistics
            properties={[property]}
            selected=""
            existingTenants={[]}
            existingRents={[]}
          />,
        );

        expect(useGetMaintenanceRecordsQuery).toHaveBeenCalledWith(
          { propertyId: "" },
          { skip: true },
        );
      });
    });
  });
});
