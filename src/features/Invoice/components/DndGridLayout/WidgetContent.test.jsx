import React from "react";

import WidgetContent from "./WidgetContent";
import { render, screen } from "@testing-library/react";
import { useGetInvoicesQuery } from "features/Api/invoiceApi";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Api/invoiceApi", () => ({
  useGetInvoicesQuery: vi.fn(),
}));

describe("Widget Content tests", () => {
  it("shows a loading skeleton while invoices are loading", () => {
    useGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { container } = render(
      <WidgetContent widget={{ filters: { invoiceIDs: ["invoice-1"] } }} />,
    );

    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("prompts the user to select an invoice when none are selected", () => {
    useGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<WidgetContent widget={{ filters: { invoiceIDs: [] } }} />);

    expect(screen.getByText("Select an invoice to begin")).toBeInTheDocument();
  });

  it("prompts the user to select an invoice when invoice IDs are missing", () => {
    useGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<WidgetContent widget={{}} />);

    expect(screen.getByText("Select an invoice to begin")).toBeInTheDocument();
  });

  it("skips fetching invoices when no invoice IDs are selected", () => {
    useGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<WidgetContent widget={{ filters: { invoiceIDs: [] } }} />);

    expect(useGetInvoicesQuery).toHaveBeenCalledWith(
      { invoiceIDs: [] },
      { skip: true },
    );
  });
});
