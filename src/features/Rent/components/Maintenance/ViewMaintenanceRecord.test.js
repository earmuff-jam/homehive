import React from "react";

import ViewMaintenanceRecord from "./ViewMaintenanceRecord";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock(
  "features/Rent/components/Maintenance/UpdateMaintenanceItemStatus",
  () => () => <div>UpdateMaintenanceItemStatus</div>,
);

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));
jest.mock("material-react-table", () => ({
  MaterialReactTable: ({ table }) => (
    <div data-testid="material-react-table">
      {JSON.stringify(table.options.data)}
    </div>
  ),
  useMaterialReactTable: jest.fn((options) => ({
    options,
  })),
}));

jest.mock("common/CustomSnackbar", () => () => <div>CustomSnackbar</div>);

describe("View maintenance record tests", () => {
  describe("ViewMaintenanceRecord", () => {
    const defaultProps = {
      propertyName: "Test Property",
      primaryTenantEmail: "tenant@test.com",
      data: [
        {
          id: "1",
          maintenanceCategory: "Plumbing",
          status: "Pending",
          description: "Leaky faucet",
          tenantEmail: "tenant@test.com",
          updatedOn: "2026-01-01T00:00:00.000Z",
        },
      ],
    };

    it("matches snapshot", () => {
      const { container } = render(<ViewMaintenanceRecord {...defaultProps} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("ViewMaintenanceRecord behavior", () => {
    const defaultProps = {
      propertyName: "Test Property",
      primaryTenantEmail: "tenant@test.com",
      data: [
        {
          id: "1",
          maintenanceCategory: "Plumbing",
          status: "Pending",
          description: "Leaky faucet",
          tenantEmail: "tenant@test.com",
          updatedOn: "2026-01-01T00:00:00.000Z",
        },
      ],
    };

    it("renders maintenance data", () => {
      render(<ViewMaintenanceRecord {...defaultProps} />);

      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "Plumbing",
      );

      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "Pending",
      );

      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "tenant@test.com",
      );
    });
  });
});
