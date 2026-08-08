import React from "react";

import PdfViewer from "./PdfViewer";
import { render } from "@testing-library/react";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useGetInvoiceListQuery } from "features/Api/invoiceApi";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useOutletContext: () => [false, vi.fn()],
}));

// Mock RTK Query hooks
vi.mock("features/Api/invoiceApi", () => ({
  useGetInvoiceListQuery: vi.fn(),
}));

vi.mock("features/Api/externalIntegrationsApi", () => ({
  useSendEmailMutation: vi.fn(),
}));

// Mock common utilities
vi.mock("common/utils", () => ({
  EditInvoiceRouteUri: "/edit",
  isSelectedFeatureEnabled: vi.fn(() => false),
}));

// Mock withDialog
vi.mock("features/Invoice/withDialog", () => ({
  default: (Component) => Component,
}));

vi.mock("common/RowHeader", () => ({
  default: ({ title, caption }) => (
    <div data-testid="row-header">
      <div>{title}</div>
      <div>{caption}</div>
    </div>
  ),
}));

describe("PdfViewer snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useGetInvoiceListQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    useSendEmailMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
      },
    ]);
  });

  it("renders snapshot when no invoiceList response is returned", () => {
    const { container } = render(<PdfViewer setDialog={vi.fn()} />);

    expect(container).toMatchSnapshot();
  });
});
