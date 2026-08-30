import React from "react";

import InvoiceTrendsChart from "./InvoiceTrends";
import { fireEvent, render, screen } from "@testing-library/react";
import InvoiceMockValues from "features/Invoice/mockConstants";
import { normalizeInvoiceTrendsChartsDataset } from "features/Invoice/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("features/Invoice/utils", async () => {
  const actual = await vi.importActual("features/Invoice/utils");

  return {
    ...actual,
    normalizeInvoiceTrendsChartsDataset: vi.fn(
      actual.normalizeInvoiceTrendsChartsDataset,
    ),
  };
});

describe("InvoiceTrendsChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EmptyComponent when data is empty", () => {
    render(<InvoiceTrendsChart data={[]} />);

    expect(
      screen.getByText("Sorry, no matching records found."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("renders the bar chart by default", () => {
    render(<InvoiceTrendsChart data={[]} />);
    expect(
      screen.getByText("Sorry, no matching records found."),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("calls normalizeInvoiceTrendsChartsDataset with bar chart type by default", () => {
    const data = [
      {
        id: "e9ca422b-71e9-42eb-9939-4b24f89fa864",
        title: "Water Repair",
        caption: "Plumbing and cleanup Cost",
        note: "All items need to be paid in full before December 31, 2026.",
        startDate: "2026-08-27T05:00:00.000Z",
        endDate: "2026-12-31T06:00:00.000Z",
        taxRate: "1.00",
        invoiceHeader: "Water Repair",
        lineItems: [
          {
            category: {
              label: "Services",
              value: "services",
            },
            description: "Water cleanup",
            caption: "Cleanup the residual water around the pipe",
            quantity: "1",
            price: "149.99",
            payment: "12",
            paymentMethod: "Cash, Bank Account",
          },
          {
            category: {
              label: "Fees",
              value: "fees",
            },
            description: "Emergency Repair Fee",
            caption: "Provided service within 24 hour of issue",
            quantity: "1",
            price: "49.99",
            payment: "0",
            paymentMethod: "Cash",
          },
        ],
        updatedOn: "2026-08-28T00:54:20.757Z",
        invoiceStatus: {
          id: 1,
          label: "Paid",
          selected: true,
          display: true,
        },
      },
      {
        id: "2ce45f4d-336d-482d-a129-ed4ce3f0f955",
        title: "Electric Repair",
        caption: "Repair of electric lines",
        note: "Utlity bills are not included in this invoice at this time.",
        startDate: "2026-07-01T05:00:00.000Z",
        endDate: "2026-07-31T05:00:00.000Z",
        taxRate: "1.00",
        invoiceHeader: "Bill Details",
        lineItems: [
          {
            category: {
              label: "Products",
              value: "products",
            },
            description: "Utility line creation",
            caption: "Creation of utility line",
            quantity: "1",
            price: "19.99",
            payment: "0",
            paymentMethod: "Bank account",
          },
          {
            category: {
              label: "Other",
              value: "other",
            },
            description: "One time fee for processing utlity charges",
            caption: "",
            quantity: "1",
            price: "149.99",
            payment: "0",
            paymentMethod: "Bank account",
          },
        ],
        updatedOn: "2026-08-28T11:38:06.219Z",
        invoiceStatus: {
          id: 2,
          label: "Draft",
          selected: true,
          display: true,
        },
      },
    ];

    render(<InvoiceTrendsChart data={data} />);

    expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
      data,
      "bar",
    );
  });

  it("renders the line chart when the line toggle is selected", () => {
    render(
      <InvoiceTrendsChart
        data={InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(screen.queryByTestId("line-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("calls normalizeInvoiceTrendsChartsDataset with line chart type after switching", () => {
    render(
      <InvoiceTrendsChart
        data={InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenLastCalledWith(
      InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data,
      "line",
    );
  });

  it("switches back to the bar chart", () => {
    render(
      <InvoiceTrendsChart
        data={InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "bar chart" }));

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders EmptyComponent when normalized chart data is null", () => {
    render(<InvoiceTrendsChart data={[]} />);

    expect(
      screen.getByText("Sorry, no matching records found."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders EmptyComponent for line charts when normalized data is null", () => {
    render(<InvoiceTrendsChart data={[]} />);

    fireEvent.click(screen.getByRole("button", { name: "line chart" }));

    expect(
      screen.getByText("Sorry, no matching records found."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });

  it("renders the chart title", () => {
    render(
      <InvoiceTrendsChart
        data={InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data}
      />,
    );

    expect(
      screen.getByText("Invoice Totals & Tax Collected Over Time"),
    ).toBeInTheDocument();
  });

  it("uses the provided data", () => {
    render(
      <InvoiceTrendsChart
        data={InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data}
      />,
    );

    expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
      InvoiceMockValues.chartDetails.InvoiceTrendsChartData.data,
      "bar",
    );
  });
});
