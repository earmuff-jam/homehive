import React from "react";

import ViewMaintenanceRecord from "./ViewMaintenanceRecord";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ViewMaintenanceRecord", () => {
  describe("ViewMaintenanceRecord snapshot tests", () => {
    const defaultProps = {
      propertyName: "Test Property",
      primaryTenantEmail: "tenant@test.com",
      data: [
        {
          id: "1",
          maintenanceCategory: "Plumbing",
          status: "Pending",
          description: "Leaky faucet",
          updatedOn: "2026-01-01T00:00:00.000Z",
        },
      ],
    };

    it("matches snapshot", () => {
      const { container } = render(<ViewMaintenanceRecord {...defaultProps} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
  describe("ViewMaintenanceRecord component tests", () => {
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
