import React from "react";

import PropertyStatistics from "./PropertyStatistics";
import { render, screen } from "@testing-library/react";
import { useGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("features/Api/maintenanceApi", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useGetMaintenanceRecordsQuery: vi.fn(),
  };
});

vi.mock(
  "features/Rent/hooks/useGetSelectedPropertyDetails",
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      useSelectedPropertyDetails: vi.fn(),
    };
  },
);

vi.mock("common/EmptyComponent", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    default: ({ caption }) => <div>{caption}</div>,
  };
});

vi.mock(
  "features/Rent/components/Reporting/PropertyHealthAccordion",
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      default: ({ label }) => <div>{label}</div>,
    };
  },
);

vi.mock(
  "features/Rent/components/Reporting/LeaseHealthAccordion",
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      default: ({ label }) => <div>{label}</div>,
    };
  },
);

vi.mock(
  "features/Rent/components/Reporting/RentCollectionAccordion",
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      default: ({ label }) => <div>{label}</div>,
    };
  },
);

vi.mock(
  "features/Rent/components/Reporting/MaintenanceHealthAccordion",
  async (importOriginal) => {
    const actual = await importOriginal();

    return {
      ...actual,
      default: ({ label }) => <div>{label}</div>,
    };
  },
);

describe("PropertyStatistics", () => {
  const property = {
    id: "property-1",
    name: "Property One",
  };

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

  describe("PropertyStatistics Snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
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

    it("skips the maintenance query when nothing is selected", () => {
      render(<PropertyStatistics properties={[property]} selected="" />);

      expect(useGetMaintenanceRecordsQuery).toHaveBeenCalledWith(
        { propertyId: "" },
        { skip: true },
      );
    });
  });
});
