import React from "react";

import ItemTypeFreqChart from "./ItemTypeFreqChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as utils from "features/Invoice/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Bar: vi.fn(() => <div data-testid="bar-chart" />),
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

describe("ItemTypeFreqChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <ItemTypeFreqChart label="Item Types" caption="Frequency overview" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders EmptyComponent when no pdfDetails in localStorage", () => {
    render(
      <ItemTypeFreqChart label="Item Types" caption="Frequency overview" />,
    );
    expect(screen.getByTestId("row-header")).toHaveTextContent(
      "Item Types - Frequency overview",
    );
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
  });

  it("renders Bar chart when pdfDetails exist in localStorage", () => {
    const mockChartData = {
      labels: ["Item A"],
      datasets: [{ label: "Frequency", data: [5] }],
    };

    vi.spyOn(utils, "normalizeInvoiceItemTypeChartDataset").mockReturnValue(
      mockChartData,
    );

    localStorage.setItem(
      "pdfDetails",
      JSON.stringify({ id: 1, name: "Invoice 1" }),
    );

    render(
      <ItemTypeFreqChart label="Item Types" caption="Frequency overview" />,
    );

    expect(utils.normalizeInvoiceItemTypeChartDataset).toHaveBeenCalledWith([
      { id: 1, name: "Invoice 1" },
    ]);

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
