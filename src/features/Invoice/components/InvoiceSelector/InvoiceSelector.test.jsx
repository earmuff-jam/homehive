import React from "react";

import InvoiceSelector from "./InvoiceSelector";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("InvoiceSelector", () => {
  const options = [
    {
      id: "invoice-1",
      invoiceHeader: "Invoice for Supplies order",
    },
    {
      id: "invoice-2",
      invoiceHeader: "Invoice for the rent of July",
    },
  ];

  it("renders invoice options", () => {
    render(
      <InvoiceSelector
        options={options}
        inputLabel="Select Invoice"
        selectedInvoice=""
        setSelectedInvoice={vi.fn()}
      />,
    );

    expect(screen.getByText("Select Invoice")).toBeInTheDocument();
  });

  it("changes the selected invoice", () => {
    const setSelectedInvoice = vi.fn();

    render(
      <InvoiceSelector
        options={options}
        inputLabel="Select Invoice"
        selectedInvoice=""
        setSelectedInvoice={setSelectedInvoice}
      />,
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));

    fireEvent.click(screen.getByText("Invoice for Supplies order"));

    expect(setSelectedInvoice).toHaveBeenCalledWith("invoice-1");
  });

  it("hides Create new when hideCreateNewSelector is true", () => {
    render(
      <InvoiceSelector
        options={options}
        inputLabel="Select Invoice"
        hideCreateNewSelector
        selectedInvoice=""
        setSelectedInvoice={vi.fn()}
      />,
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));

    expect(screen.queryByText("Create new ...")).not.toBeInTheDocument();
    expect(screen.getByText("Invoice for Supplies order")).toBeInTheDocument();
  });
});
