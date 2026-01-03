import React from "react";

import DetailsTableView from "./DetailsTableView";
import { render, screen } from "@testing-library/react";

describe("DetailsTableView component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <DetailsTableView label="Invoice Details" caption="Summary view" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders RowHeader with label and caption", () => {
    render(<DetailsTableView label="Invoice Details" caption="Summary view" />);
    expect(screen.getByText("Invoice Details")).toBeInTheDocument();
    expect(screen.getByText("Summary view")).toBeInTheDocument();
  });

  it("renders MaterialReactTable mock", () => {
    render(<DetailsTableView label="Invoice Details" caption="Summary view" />);
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });
});
