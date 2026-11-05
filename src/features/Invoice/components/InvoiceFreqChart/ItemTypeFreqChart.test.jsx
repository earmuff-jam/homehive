import React from "react";

import ItemTypeFreqChart from "./ItemTypeFreqChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InvoiceMockValues from "features/Invoice/mockConstants";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("chart.js", () => ({
  BarElement: {},
  CategoryScale: {},
  Chart: {
    register: vi.fn(),
  },
  Legend: {},
  LinearScale: {},
  Title: {},
  Tooltip: {},
}));

vi.mock("react-chartjs-2", () => ({
  Bar: ({ data }) => (
    <div data-testid="bar-chart">
      <div data-testid="bar-chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

describe("ItemTypeFreqChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmptyComponent when data is empty", () => {
    render(<ItemTypeFreqChart data={[]} />);

    expect(
      screen.getByText("Sorry, no matching records found."),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("renders EmptyComponent when data is not provided", () => {
    render(<ItemTypeFreqChart />);

    expect(
      screen.getByText("Sorry, no matching records found."),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("renders Bar chart when invoice data is available", () => {
    render(<ItemTypeFreqChart data={InvoiceMockValues.invoiceDetails} />);

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();

    expect(
      screen.queryByText("Sorry, no matching records found."),
    ).not.toBeInTheDocument();
  });

  it("passes normalized invoice item type data to Bar", () => {
    render(<ItemTypeFreqChart data={InvoiceMockValues.invoiceDetails} />);

    const chartData = JSON.parse(
      screen.getByTestId("bar-chart-data").textContent,
    );

    expect(chartData.datasets[0].label).toEqual(
      InvoiceMockValues.chartDetails.InvoiceItemTypeFreqChartData.datasets[0]
        .label,
    );

    expect(chartData.datasets[0].data.length).toEqual(2);
    expect(chartData.datasets[0].data[0]).toEqual(1);
    expect(chartData.datasets[0].data[0]).toEqual(1);
  });

  it("renders all invoice item type categories in the chart", () => {
    render(<ItemTypeFreqChart data={InvoiceMockValues.invoiceDetails} />);

    const chartData = JSON.parse(
      screen.getByTestId("bar-chart-data").textContent,
    );

    expect(chartData.labels).toEqual(["Fees", "Services"]);

    expect(chartData.datasets).toHaveLength(1);

    expect(chartData.datasets[0]).toMatchObject({
      label: "Item Type Frequency",
      data: [1, 1],
    });
  });
});
