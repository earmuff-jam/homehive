import React from "react";

import InvoiceTimelineChart from "./InvoiceTimelineChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as utils from "features/Invoice/utils/utils";

// Mock chart.js wrapper
jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => <div data-testid="bar-chart" />),
}));

// Mock other components
jest.mock("common/EmptyComponent", () => () => (
  <div data-testid="empty-component" />
));
jest.mock("common/RowHeader/RowHeader", () => (props) => (
  <div data-testid="row-header">
    {props.title} - {props.caption}
  </div>
));

describe("InvoiceTimelineChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <InvoiceTimelineChart label="Timeline" caption="Overview" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders EmptyComponent when no pdfDetails are in localStorage", () => {
    render(<InvoiceTimelineChart label="Timeline" caption="Overview" />);

    expect(screen.getByTestId("row-header")).toHaveTextContent(
      "Timeline - Overview",
    );
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
  });

  it("renders Bar chart when pdfDetails exist in localStorage", () => {
    const mockChartData = {
      labels: ["Invoice 1"],
      datasets: [{ label: "Duration", data: [10] }],
    };

    jest
      .spyOn(utils, "normalizeInvoiceTimelineChartDataset")
      .mockReturnValue(mockChartData);

    localStorage.setItem(
      "pdfDetails",
      JSON.stringify({ id: 1, name: "Invoice 1" }),
    );

    render(<InvoiceTimelineChart label="Timeline" caption="Overview" />);

    expect(utils.normalizeInvoiceTimelineChartDataset).toHaveBeenCalledWith([
      { id: 1, name: "Invoice 1" },
    ]);

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
