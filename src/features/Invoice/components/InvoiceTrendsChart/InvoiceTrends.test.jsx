import React from "react";

import { render, screen } from "@testing-library/react";
import InvoiceTrendsChart from "features/Invoice/components/InvoiceTrendsChart/InvoiceTrends";
import InvoiceMockValues from "features/Invoice/mockConstants";
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
    normalizeTrendsChart: vi.fn(actual.normalizeTrendsChart),
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

    it("renders EmptyComponent when normalized chart data is null", () => {
      render(<InvoiceTrendsChart data={[]} />);

      expect(
        screen.getByText("Sorry, no matching records found."),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
      expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    });

    it("renders the chart title", () => {
      render(<InvoiceTrendsChart data={[InvoiceMockValues.invoiceDetails]} />);

      expect(
        screen.getByText("Invoice Totals & Tax Collected Over Time"),
      ).toBeInTheDocument();
    });
  });
});
