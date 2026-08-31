import React from "react";

import InvoiceTrendsChart from "./InvoiceTrends";
import { fireEvent, render, screen } from "@testing-library/react";
import InvoiceMockValues from "features/Invoice/mockConstants";
import { normalizeInvoiceTrendsChartsDataset } from "features/Invoice/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { afterEach } from "vitest";

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

describe("Invoice trends chart tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-12T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  describe("Invoice trends chart snapshot tests", () => {
    it("matches the snapshot with valid datasets", () => {
      const { asFragment } = render(
        <InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Invoice trends chart component tests", () => {
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
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

      expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
        [InvoiceMockValues.invoiceDetails],
        "bar",
      );
    });

    it("renders the line chart when the line toggle is selected", () => {
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

      fireEvent.click(screen.getByRole("button", { name: "line chart" }));

      expect(screen.queryByTestId("line-chart")).toBeInTheDocument();
      expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("calls normalizeInvoiceTrendsChartsDataset with line chart type after switching", () => {
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

      fireEvent.click(screen.getByRole("button", { name: "line chart" }));

      expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenLastCalledWith(
        [InvoiceMockValues.invoiceDetails],
        "line",
      );
    });

    it("switches back to the bar chart", () => {
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

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
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

      expect(
        screen.getByText("Invoice Totals & Tax Collected Over Time"),
      ).toBeInTheDocument();
    });

    it("uses the provided data", () => {
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

      expect(normalizeInvoiceTrendsChartsDataset).toHaveBeenCalledWith(
        [InvoiceMockValues.invoiceDetails],
        "bar",
      );
    });
  });
});
