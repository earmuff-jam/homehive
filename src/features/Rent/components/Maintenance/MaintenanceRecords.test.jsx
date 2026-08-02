import React from "react";

import MaintenanceRecords from "./MaintenanceRecords";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("common/RowHeader", () => ({
  __esModule: true,
  default: ({ title, caption }) => (
    <div data-testid="row-header">
      {title}
      {caption}
    </div>
  ),
}));

vi.mock("features/Rent/components/Maintenance/ViewMaintenanceRecord", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="view-maintenance-record">{JSON.stringify(props)}</div>
  ),
}));

const defaultProps = {
  isPropertyOwner: false,
  isMaintenanceRecordsLoading: false,
  maintenanceRecords: [
    {
      id: "1",
      description: "Leaky faucet",
    },
  ],
  property: {
    id: "property-id",
    name: "Test Property",
  },
  primaryTenantEmail: "tenant@test.com",
  dataTour: "maintenance-tour",
};

describe("Maintenance Records", () => {
  it("matches snapshot", () => {
    const { container } = render(<MaintenanceRecords {...defaultProps} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  describe("MaintenanceRecords", () => {
    it("renders loading skeleton when loading", () => {
      const props = {
        ...defaultProps,
        isMaintenanceRecordsLoading: true,
      };

      const { container } = render(<MaintenanceRecords {...props} />);

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
      render(<MaintenanceRecords {...defaultProps} />);

      expect(screen.getByTestId("view-maintenance-record")).toBeInTheDocument();

      expect(screen.getByText(/Leaky faucet/)).toBeInTheDocument();
    });

    it("passes props to ViewMaintenanceRecord", () => {
      render(<MaintenanceRecords {...defaultProps} />);

      const component = screen.getByTestId("view-maintenance-record");

      expect(component).toHaveTextContent("Test Property");
      expect(component).toHaveTextContent("tenant@test.com");
    });

    it("sets data-tour attribute", () => {
      render(<MaintenanceRecords {...defaultProps} />);

      expect(
        document.querySelector('[data-tour="maintenance-tour"]'),
      ).toBeInTheDocument();
    });
  });
});
