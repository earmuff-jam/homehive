import React from "react";

import ViewRentalPaymentSummary from "./ViewRentalPaymentSummary";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { lightTheme } from "src/Theme";

const mockRentData = [
  {
    tenantEmail: "charlieWilliam@gmail.com",
    rentAmount: 1000,
    additionalCharges: 50,
    initialLateFee: 10,
    dailyLateFee: 5,
    status: "complete",
    rentMonth: "Feb",
    updatedOn: "2026-02-28T10:00:00Z",
    note: "Monthly rent and utility bill included in rent",
  },
  {
    tenantEmail: "maria-nicole23@gmail.com",
    rentAmount: 39.99,
    status: "Manual",
    rentMonth: "March",
    updatedOn: "2026-03-10T10:00:00Z",
    note: "Emergency generator needed fuel and oil replacement",
  },
];

const renderComponent = (data) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <ViewRentalPaymentSummary rentData={data} />
    </ThemeProvider>,
  );

describe("ViewRentalPaymentSummary Jest Tests", () => {
  describe("ViewRentalPaymentSummary Snapshot Tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = renderComponent(mockRentData);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("ViewRentalPaymentSummary Component Tests", () => {
    it("renders table headers", () => {
      renderComponent(mockRentData);

      expect(screen.getByText("Tenant Email")).toBeInTheDocument();
      expect(screen.getByText("Amount Paid ($)")).toBeInTheDocument();
      expect(screen.getByText("Payment Method")).toBeInTheDocument();
      expect(screen.getByText("Rent Month")).toBeInTheDocument();
      expect(screen.getByText("Updated on")).toBeInTheDocument();
    });

    it("renders tenant payment data", () => {
      renderComponent(mockRentData);

      expect(screen.getByText("maria-nicole23@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Manual")).toBeInTheDocument();
      expect(screen.getByText("March")).toBeInTheDocument();
    });

    it("shows empty state when no data", () => {
      renderComponent([]);

      expect(
        screen.queryByText("maria-nicole23@gmail.com"),
      ).not.toBeInTheDocument();
    });
  });
});
