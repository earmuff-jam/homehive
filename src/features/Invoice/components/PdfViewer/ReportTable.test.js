// ReportTable.test.jsx
import React from "react";

import { MemoryRouter } from "react-router-dom";

import ReportTable from "./ReportTable";
import { render, screen } from "@testing-library/react";

describe("Report Table Component tests", () => {
  describe("Report Table Snapshot tests", () => {
    test("PdfViewer snapshot", () => {
      const { asFragment } = render(
        <MemoryRouter>
          <ReportTable />
        </MemoryRouter>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("Report Table tests", () => {
    describe("ReportTable", () => {
      const mockRows = [
        {
          category: "Rent",
          descpription: "Monthly rent",
          caption: "April",
          quantity: 1,
          price: 1000,
          payment: 500,
        },
      ];

      const mockInvoiceStatus = {
        label: "Paid",
        display: true,
      };

      it("renders without crashing and displays data", () => {
        render(
          <ReportTable
            rows={mockRows}
            taxRate={10}
            showWatermark={false}
            invoiceStatus={mockInvoiceStatus}
            invoiceTitle="Test Invoice"
          />,
        );

        expect(screen.getByText(/Test Invoice/i)).toBeInTheDocument();

        expect(screen.getByText(/Monthly rent/i)).toBeInTheDocument();
        expect(screen.getByText(/April/i)).toBeInTheDocument();
      });
    });
  });
});
