import React from "react";

import InvoiceTimelineChart from "./InvoiceTimelineChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as utils from "features/Invoice/utils";

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

    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
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
