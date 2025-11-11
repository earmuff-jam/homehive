import React from "react";
import { render, screen } from "@testing-library/react";
import DetailsTableView from "./DetailsTableView";

// Mock common components and libraries
jest.mock("common/RowHeader/RowHeader", () => ({
  __esModule: true,
  default: ({ title, caption }) => (
    <div data-testid="row-header">
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

jest.mock("common/EmptyComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="empty">Empty</div>,
}));

jest.mock("features/Invoice/utils", () => ({
  noramlizeDetailsTableData: jest.fn((data) => data),
}));

jest.mock("material-react-table", () => ({
  MaterialReactTable: ({ table }) => (
    <div data-testid="mock-table">Mock Table ({table.data.length} rows)</div>
  ),
  useMaterialReactTable: jest.fn((config) => config),
}));

describe("DetailsTableView component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <DetailsTableView label="Invoice Details" caption="Summary view" />
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
