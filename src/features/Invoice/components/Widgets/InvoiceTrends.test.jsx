import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import InvoiceTrendsChart from "./InvoiceTrends";
import { normalizeInvoiceTrendsChartsDataset } from "features/Invoice/utils";

vi.mock("react-chartjs-2", () => ({
  Bar: ({ data, options }) => (
    <div data-testid="bar-chart">
      Bar Chart
      <span data-testid="chart-title">{options.plugins.title.text}</span>
      <span data-testid="chart-data">{JSON.stringify(data)}</span>
    </div>
  ),
  Line: ({ data, options }) => (
    <div data-testid="line-chart">
      Line Chart
      <span data-testid="chart-title">{options.plugins.title.text}</span>
      <span data-testid="chart-data">{JSON.stringify(data)}</span>
    </div>
  ),
}));


describe("InvoiceTrendsChart", () => {
  const chartData = {
    labels: ["Jan", "Feb"],
    datasets: [
      {
        label: "Invoice Totals",
        data: [100, 200],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    normalizeInvoiceTrendsChartsDataset.mockReturnValue(chartData);
  });

  it("renders the bar chart by default", () => {
    render(<InvoiceTrendsChart data={{}} />);

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("calls normalizeInvoiceTrendsChartsDataset with bar chart type by default", () => {
    const data = {
      invoices: [],
    };

    render(<InvoiceTrendsChart data={data} />);

    expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
      data,
      "bar",
    );
  });

  it("renders the line chart when the line toggle is selected", () => {
    render(<InvoiceTrendsChart data={{}} />);

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("calls normalizeInvoiceTrendsChartsDataset with line chart type after switching", () => {
    const data = {
      invoices: [],
    };

    render(<InvoiceTrendsChart data={data} />);

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenLastCalledWith(
      data,
      "line",
    );
  });

  it("switches back to the bar chart", () => {
    render(<InvoiceTrendsChart data={{}} />);

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "bar chart" }));

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders EmptyComponent when normalized chart data is null", () => {
    normalizeInvoiceTrendsChartsDataset.mockReturnValue(null);

    render(<InvoiceTrendsChart data={{}} />);

    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders EmptyComponent for line charts when normalized data is null", () => {
    normalizeInvoiceTrendsChartsDataset.mockReturnValue(null);

    render(<InvoiceTrendsChart data={{}} />);

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders the chart title", () => {
    render(<InvoiceTrendsChart data={{}} />);

    expect(
      screen.getByText("Invoice Totals & Tax Collected Over Time"),
    ).toBeInTheDocument();
  });

  it("uses the provided data", () => {
    const data = {
      invoices: [
        {
          date: "2026-01-01",
          total: 100,
        },
      ],
    };

    render(<InvoiceTrendsChart data={data} />);

    expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
      data,
      "bar",
    );
  });
});
