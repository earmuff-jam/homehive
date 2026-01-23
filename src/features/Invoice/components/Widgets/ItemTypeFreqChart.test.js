import React from "react";

import ItemTypeFreqChart from "./ItemTypeFreqChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as utils from "features/Invoice/utils";

jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => <div data-testid="bar-chart" />),
}));
jest.mock("common/EmptyComponent", () => () => (
  <div data-testid="empty-component" />
));
jest.mock("common/RowHeader", () => (props) => (
  <div data-testid="row-header">
    {props.title} - {props.caption}
  </div>
));

describe("ItemTypeFreqChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    jest
      .spyOn(utils, "normalizeInvoiceItemTypeChartDataset")
      .mockReturnValue(mockChartData);

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
