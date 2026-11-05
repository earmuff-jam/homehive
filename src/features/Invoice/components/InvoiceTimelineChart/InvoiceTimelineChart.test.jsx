import React from "react";

import InvoiceTimelineChart from "./InvoiceTimelineChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InvoiceMockValues from "features/Invoice/mockConstants";
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
      render(
        <InvoiceTimelineChart data={[InvoiceMockValues.invoiceDetails]} />,
      );

      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.queryByTestId("empty-component")).not.toBeInTheDocument();
    });
  });
});
