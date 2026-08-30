import React from "react";

import ViewRentalPaymentSummary from "./ViewRentalPaymentSummary";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { lightTheme } from "src/Theme";
import { describe, expect, it } from "vitest";

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

const renderComponent = (data = mockRentData) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <ViewRentalPaymentSummary rentData={data} />
    </ThemeProvider>,
  );

describe("View Rental Payment Summary tests", () => {
  describe("View rental payment summary snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = renderComponent();

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("View rental payment summary component tests", () => {
    it("renders table headers", () => {
      renderComponent();

      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "charlieWilliam@gmail.com",
      );
      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "maria-nicole23@gmail.com",
      );
      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        1000,
      );
      expect(screen.getByTestId("material-react-table")).toHaveTextContent(50);
    });

    it("renders tenant payment data", () => {
      renderComponent();

      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "charlieWilliam@gmail.com",
      );
      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        "maria-nicole23@gmail.com",
      );
      expect(screen.getByTestId("material-react-table")).toHaveTextContent(
        1000,
      );
      expect(screen.getByTestId("material-react-table")).toHaveTextContent(50);
    });

    it("shows empty state when no data", () => {
      renderComponent([]);

      expect(
        screen.queryByText("maria-nicole23@gmail.com"),
      ).not.toBeInTheDocument();
    });
  });
});
