import React from "react";

import DetailsTableView from "./DetailsTableView";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("common/RowHeader", () => ({
  __esModule: true,
  default: ({ title, caption }) => (
    <div data-testid="row-header">
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

vi.mock("common/EmptyComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="empty">Empty</div>,
}));

vi.mock("features/Invoice/utils", () => ({
  noramlizeDetailsTableData: vi.fn((data) => data),
}));

vi.mock("material-react-table", () => ({
  MaterialReactTable: ({ table }) => (
    <div data-testid="mock-table">Mock Table ({table.data.length} rows)</div>
  ),
  useMaterialReactTable: vi.fn((config) => config),
}));

describe("DetailsTableView component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
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
