import React from "react";

import ItemTypeFreqChart from "./ItemTypeFreqChart";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { parseJsonUtility } from "common/utils";
import * as utils from "features/Invoice/utils";

describe("ItemTypeFreqChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <ItemTypeFreqChart label="Item Types" caption="Frequency overview" />,
    );

    expect(screen.getByText("Item Types")).toBeInTheDocument();
    expect(screen.getByText("Frequency overview")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toHaveTextContent(
      "Sorry, no matching records found.",
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders EmptyComponent when no pdfDetails in localStorage", () => {
    render(
      <ItemTypeFreqChart label="Item Types" caption="Frequency overview" />,
    );
    expect(screen.getByText("Item Types")).toBeInTheDocument();
    expect(screen.getByText("Frequency overview")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toBeInTheDocument();
    expect(screen.getByTestId("empty-component")).toHaveTextContent(
      "Sorry, no matching records found.",
    );
  });

  it("renders Bar chart when pdfDetails exist in localStorage", () => {
    const mockChartData = {
      labels: ["Item A"],
      datasets: [{ label: "Frequency", data: [5] }],
    };

    parseJsonUtility.mockReturnValue({ id: 1, name: "Invoice 1" });
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
