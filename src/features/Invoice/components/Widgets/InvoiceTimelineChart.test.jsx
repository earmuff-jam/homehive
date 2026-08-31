import React from "react";

import InvoiceTimelineChart from "./InvoiceTimelineChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InvoiceMockValues from "features/Invoice/mockConstants";
import * as utils from "features/Invoice/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Bar: ({ data, options }) => (
    <div data-testid="bar-chart">
      <span data-testid="chart-data">{JSON.stringify(data)}</span>
      <span data-testid="chart-options">{JSON.stringify(options)}</span>
    </div>
  ),
}));

describe("Invoice timeline chart tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-12T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Invoice timeline chart snapshot tests", () => {
    it("matches the snapshot with valid datasets", () => {
      const { asFragment } = render(
        <InvoiceTimelineChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("Invoice timeline chart component tests", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders EmptyComponent when data is empty", () => {
      render(<InvoiceTimelineChart data={[]} />);

      expect(
        screen.getByText("Sorry, no matching records found."),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("renders EmptyComponent when data is not provided", () => {
      render(<InvoiceTimelineChart />);

      expect(
        screen.getByText("Sorry, no matching records found."),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    });

    it("renders the Bar chart when invoice data exists", () => {
      vi.spyOn(utils, "normalizeInvoiceTimelineChartDataset").mockReturnValue(
        InvoiceMockValues.chartDetails.InvoiceTimelineChartData,
      );

      render(
        <InvoiceTimelineChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      expect(utils.normalizeInvoiceTimelineChartDataset).toHaveBeenCalledTimes(
        1,
      );

      expect(utils.normalizeInvoiceTimelineChartDataset).toHaveBeenCalledWith([
        InvoiceMockValues.invoiceDetails,
      ]);

      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();

      expect(screen.queryByTestId("empty-component")).not.toBeInTheDocument();
    });

    it("passes the normalized chart data to Bar", () => {
      vi.spyOn(utils, "normalizeInvoiceTimelineChartDataset").mockReturnValue(
        InvoiceMockValues.chartDetails.InvoiceTimelineChartData,
      );

      render(
        <InvoiceTimelineChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      expect(screen.getByTestId("chart-data")).toHaveTextContent(
        JSON.stringify(InvoiceMockValues.chartDetails.InvoiceTimelineChartData),
      );
    });

    it("configures the chart as a horizontal timeline", () => {
      vi.spyOn(utils, "normalizeInvoiceTimelineChartDataset").mockReturnValue(
        InvoiceMockValues.chartDetails.InvoiceTimelineChartData,
      );

      render(
        <InvoiceTimelineChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      const options = JSON.parse(
        screen.getByTestId("chart-options").textContent,
      );

      expect(options.indexAxis).toBe("y");
      expect(options.responsive).toBe(true);

      expect(options.plugins.title).toEqual({
        display: true,
        text: "Invoice Timeline",
      });

      expect(options.scales.x).toMatchObject({
        type: "time",
        title: {
          display: true,
          text: "Date",
        },
        time: {
          unit: "month",
          displayFormats: {
            month: "MMM YY",
          },
        },
      });

      expect(options.scales.y).toEqual({
        display: false,
      });
    });

    it("configures the tooltip to display invoice timeline details", () => {
      vi.spyOn(utils, "normalizeInvoiceTimelineChartDataset").mockReturnValue(
        InvoiceMockValues.chartDetails.InvoiceTimelineChartData,
      );

      render(
        <InvoiceTimelineChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      const options = JSON.parse(
        screen.getByTestId("chart-options").textContent,
      );

      expect(options.plugins.tooltip.displayColors).toBe(false);
    });
  });
});
