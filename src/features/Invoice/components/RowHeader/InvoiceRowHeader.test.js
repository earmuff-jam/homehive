import React from "react";

import dayjs from "dayjs";

import InvoiceRowHeader from "./InvoiceRowHeader";
import { render, screen } from "@testing-library/react";

describe("InvoiceRowHeader", () => {
  it("renders title and caption", () => {
    render(<InvoiceRowHeader title="Invoice Details" caption="Monthly Rent" />);

    expect(screen.getByText("Invoice Details")).toBeInTheDocument();
    expect(screen.getByText("Monthly Rent")).toBeInTheDocument();
  });

  it("renders created date when showDate is true", () => {
    const date = dayjs("2025-01-01");

    render(<InvoiceRowHeader title="Invoice" showDate createdDate={date} />);

    expect(screen.getByText("Created on 01-01-2025")).toBeInTheDocument();
  });

  it("does not render date when showDate is false", () => {
    render(<InvoiceRowHeader title="Invoice" />);

    expect(screen.queryByText(/Created on/i)).not.toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <InvoiceRowHeader title="Invoice">
        <div>Child Content</div>
      </InvoiceRowHeader>,
    );

    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });
});
