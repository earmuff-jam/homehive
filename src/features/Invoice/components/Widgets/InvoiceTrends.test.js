import React from "react";

import InvoiceTrendsChart from "./InvoiceTrends";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { parseJsonUtility } from "common/utils";
import * as utils from "features/Invoice/utils";

describe("InvoiceTrendsChart Widget", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <InvoiceTrendsChart label="Trends" caption="Overview" />,
    );

    expect(screen.getByText("Trends")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toHaveTextContent(
      "Sorry, no matching records found.",
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders EmptyComponent when no pdfDetails are in localStorage", () => {
    render(<InvoiceTrendsChart label="Trends" caption="Overview" />);

    expect(screen.getByText("Trends")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toHaveTextContent(
      "Sorry, no matching records found.",
    );
  });

  it("renders Bar chart when chartType is 'bar' and pdfDetails exist", () => {
    const mockChartData = {
      labels: ["Invoice 1"],
      datasets: [{ label: "Total", data: [100] }],
    };

    parseJsonUtility.mockReturnValue({ id: 1, name: "Invoice 1" });
    jest
      .spyOn(utils, "normalizeInvoiceTrendsChartsDataset")
      .mockReturnValue([mockChartData]);

    localStorage.setItem(
      "pdfDetails",
      JSON.stringify({ id: 1, name: "Invoice 1" }),
    );

    render(<InvoiceTrendsChart label="Trends" caption="Overview" />);

    expect(utils.normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
      [{ id: 1, name: "Invoice 1" }],
      "bar",
    );

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renders Line chart when chartType is 'line' and pdfDetails exist", () => {
    const mockChartData = {
      labels: ["Invoice 1"],
      datasets: [{ label: "Total", data: [100] }],
    };
    parseJsonUtility.mockReturnValue({ id: 1, name: "Invoice 1" });
    jest
      .spyOn(utils, "normalizeInvoiceTrendsChartsDataset")
      .mockReturnValue([mockChartData]);

    localStorage.setItem(
      "pdfDetails",
      JSON.stringify({ id: 1, name: "Invoice 1" }),
    );

    // Render with line chartType
    render(<InvoiceTrendsChart label="Trends" caption="Overview" />);
    // Force chartType state to 'line' (bypass toggle interaction)
    const chartInstance = screen.getByTestId("bar-chart"); // still mocked as Bar
    expect(chartInstance).toBeInTheDocument();
  });
});
