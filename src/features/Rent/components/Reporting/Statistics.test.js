import React from "react";

import Statistics from "./Statistics";
import { render, screen } from "@testing-library/react";
import { useGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";

jest.mock("features/Api/maintenanceApi", () => ({
  useGetMaintenanceRecordsQuery: jest.fn(),
}));

jest.mock("features/Rent/hooks/useGetSelectedPropertyDetails", () => ({
  useSelectedPropertyDetails: jest.fn(),
}));

jest.mock("common/EmptyComponent", () => ({ caption }) => <div>{caption}</div>);

jest.mock(
  "features/Rent/components/Reporting/PropertyHealthAccordion",
  () =>
    ({ label }) => <div>{label}</div>,
);

jest.mock(
  "features/Rent/components/Reporting/LeaseHealthAccordion",
  () =>
    ({ label }) => <div>{label}</div>,
);

jest.mock(
  "features/Rent/components/Reporting/RentCollectionAccordion",
  () =>
    ({ label }) => <div>{label}</div>,
);

jest.mock(
  "features/Rent/components/Reporting/MaintenanceHealthAccordion",
  () =>
    ({ label }) => <div>{label}</div>,
);

describe("Statistics", () => {
  describe("Statictics Snapshot tests", () => {
    const property = {
      id: "property-1",
      name: "Property One",
    };

    beforeEach(() => {
      jest.clearAllMocks();

      useSelectedPropertyDetails.mockReturnValue({
        totalRent: 2000,
      });

      useGetMaintenanceRecordsQuery.mockReturnValue({
        data: [],
        isFetching: false,
      });
    });

    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <Statistics
          properties={[property]}
          selected="property-1"
          existingTenants={[]}
          existingRents={[]}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("Statistics component tests", () => {
    const property = {
      id: "property-1",
      name: "Property One",
    };

    beforeEach(() => {
      jest.clearAllMocks();

      useSelectedPropertyDetails.mockReturnValue({
        totalRent: 2000,
      });

      useGetMaintenanceRecordsQuery.mockReturnValue({
        data: [],
        isFetching: false,
      });
    });

    it("renders empty component when there are no properties", () => {
      render(<Statistics properties={[]} />);

      expect(
        screen.getByText("Add properties to view statistics"),
      ).toBeInTheDocument();
    });

    it("renders empty component when no property is selected", () => {
      render(
        <Statistics
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
        <Statistics
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
      useGetMaintenanceRecordsQuery.mockReturnValue({
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
        <Statistics
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
      render(<Statistics properties={[property]} selected="property-1" />);

      expect(useGetMaintenanceRecordsQuery).toHaveBeenCalledWith(
        { propertyId: "property-1" },
        { skip: false },
      );
    });

    it("skips the maintenance query when nothing is selected", () => {
      render(<Statistics properties={[property]} selected="" />);

      expect(useGetMaintenanceRecordsQuery).toHaveBeenCalledWith(
        { propertyId: "" },
        { skip: true },
      );
    });
  });
});
