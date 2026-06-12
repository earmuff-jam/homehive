import React from "react";

import MaintenanceRecords from "./MaintenanceRecords";
import { render, screen } from "@testing-library/react";

jest.mock("common/RowHeader", () => (props) => (
  <div data-testid="row-header">
    {props.title}
    {props.caption}
  </div>
));

jest.mock(
  "features/Rent/components/Maintenance/ViewMaintenanceRecord",
  () => (props) => (
    <div data-testid="view-maintenance-record">{JSON.stringify(props)}</div>
  ),
);

describe("Maintenance Records", () => {
  it("matches snapshot", () => {
    const { container } = render(
      <MaintenanceRecords
        isMaintenanceRecordsLoading={false}
        maintenanceRecords={[
          {
            id: "1",
            description: "Leaky faucet",
          },
        ]}
        propertyName="Test Property"
        primaryTenantEmail="tenant@test.com"
        dataTour="maintenance-tour"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  describe("MaintenanceRecords", () => {
    it("renders loading skeleton when loading", () => {
      const { container } = render(
        <MaintenanceRecords
          isMaintenanceRecordsLoading
          maintenanceRecords={[]}
          propertyName="Test Property"
          primaryTenantEmail="tenant@test.com"
        />,
      );

      expect(screen.getByTestId("row-header")).toBeInTheDocument();
      expect(screen.getByTestId("row-header")).toHaveTextContent(
        "Maintenance Overview",
      );

      expect(screen.getByTestId("row-header")).toHaveTextContent(
        "View maintenance requests for Test Property",
      );

      expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();

      expect(
        screen.queryByTestId("view-maintenance-record"),
      ).not.toBeInTheDocument();
    });

    it("renders ViewMaintenanceRecord when not loading", () => {
      const maintenanceRecords = [{ id: "1", description: "Leaky faucet" }];

      render(
        <MaintenanceRecords
          isMaintenanceRecordsLoading={false}
          maintenanceRecords={maintenanceRecords}
          propertyName="Test Property"
          primaryTenantEmail="tenant@test.com"
        />,
      );

      expect(screen.getByTestId("view-maintenance-record")).toBeInTheDocument();

      expect(screen.getByText(/Leaky faucet/)).toBeInTheDocument();
    });

    it("passes props to ViewMaintenanceRecord", () => {
      render(
        <MaintenanceRecords
          isMaintenanceRecordsLoading={false}
          maintenanceRecords={[{ id: "1" }]}
          propertyName="Test Property"
          primaryTenantEmail="tenant@test.com"
        />,
      );

      const component = screen.getByTestId("view-maintenance-record");

      expect(component).toHaveTextContent("Test Property");
      expect(component).toHaveTextContent("tenant@test.com");
    });

    it("sets data-tour attribute", () => {
      render(
        <MaintenanceRecords
          isMaintenanceRecordsLoading={false}
          maintenanceRecords={[]}
          propertyName="Test Property"
          primaryTenantEmail="tenant@test.com"
          dataTour="maintenance-tour"
        />,
      );

      expect(
        document.querySelector('[data-tour="maintenance-tour"]'),
      ).toBeInTheDocument();
    });
  });
});
