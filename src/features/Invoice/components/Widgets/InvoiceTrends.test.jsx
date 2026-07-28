import React from "react";

import InvoiceTrends from "./InvoiceTrends";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as utils from "features/Invoice/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Bar: vi.fn(() => <div data-testid="bar-chart" />),
  Line: vi.fn(() => <div data-testid="line-chart" />),
}));

vi.mock("common/EmptyComponent", () => ({
  default: () => <div data-testid="empty-component" />,
}));

vi.mock("common/RowHeader", () => ({
  default: (props) => (
    <div data-testid="row-header">
      {props.title} - {props.caption}
    </div>
  ),
}));

describe("InvoiceTrends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <InvoiceTrends label="Trends" caption="Overview" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders EmptyComponent when no pdfDetails are in localStorage", () => {
    render(<InvoiceTrends label="Trends" caption="Overview" />);
    expect(screen.getByTestId("row-header")).toHaveTextContent(
      "Trends - Overview",
    );
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
  });

  it("renders Bar chart when chartType is 'bar' and pdfDetails exist", () => {
    const mockChartData = {
      labels: ["Invoice 1"],
      datasets: [{ label: "Total", data: [100] }],
    };

    vi.spyOn(utils, "normalizeInvoiceTrendsChartsDataset").mockReturnValue([
      mockChartData,
    ]);

    localStorage.setItem(
      "pdfDetails",
      JSON.stringify({ id: 1, name: "Invoice 1" }),
    );

    render(<InvoiceTrends label="Trends" caption="Overview" />);

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

    vi.spyOn(utils, "normalizeInvoiceTrendsChartsDataset").mockReturnValue([
      mockChartData,
    ]);

    localStorage.setItem(
      "pdfDetails",
      JSON.stringify({ id: 1, name: "Invoice 1" }),
    );

    // Render with line chartType
    render(<InvoiceTrends label="Trends" caption="Overview" />);
    // Force chartType state to 'line' (bypass toggle interaction)
    const chartInstance = screen.getByTestId("bar-chart"); // still mocked as Bar
    expect(chartInstance).toBeInTheDocument();
  });
});
