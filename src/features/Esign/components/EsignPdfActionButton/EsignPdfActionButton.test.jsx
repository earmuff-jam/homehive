import React from "react";

import EsignPdfActionButton from "./EsignPdfActionButton";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { uuidv4Mock } = vi.hoisted(() => ({
  uuidv4Mock: vi.fn(() => "generated-uuid"),
}));

vi.mock("uuid", () => ({
  v4: uuidv4Mock,
}));

vi.mock("common/AButton", () => ({
  default: ({ label, onClick, disabled, loading }) => (
    <button onClick={onClick} disabled={disabled} data-loading={loading}>
      {label}
    </button>
  ),
}));

vi.mock("features/Esign/components/Esign/UploadEsignDocument", () => ({
  default: ({ isDisabled, handleUpload }) => (
    <button
      data-testid="upload-document"
      disabled={isDisabled}
      onClick={handleUpload}
    >
      Upload Document
    </button>
  ),
}));

vi.mock("features/Esign/components/TokenMenu/ViewTokenMenu", () => ({
  default: ({ anchorEl, open, handleClose }) => (
    <div data-testid="token-menu">
      <span data-testid="token-menu-open">{String(open)}</span>
      <span data-testid="token-menu-anchor">
        {anchorEl ? "anchored" : "no-anchor"}
      </span>
      <button onClick={handleClose}>Close Token Menu</button>
    </div>
  ),
}));

describe("EsignPdfActionButton", () => {
  let props;

  beforeEach(() => {
    vi.clearAllMocks();

    props = {
      validTokensForETSS: 10,
      tokenAnchor: null,
      setTokenAnchor: vi.fn(),
      ltMediumFormFactor: false,
      getEditablePdfDocument: vi.fn(),
      handlePrepareEsign: vi.fn(),
      file: new File(["PDF content"], "document.pdf", {
        type: "application/pdf",
      }),
      fields: [{ name: "tenantName", value: "John Doe" }],
      selectedEsignDocument: {
        id: "document-123",
      },
      isLoadingValidTokensForETSS: false,
      isCreateEsignDocumentLoading: false,
    };
  });

  const renderComponent = (overrides = {}) =>
    render(<EsignPdfActionButton {...props} {...overrides} />);

  it("renders the token balance", () => {
    renderComponent();

    expect(screen.getByText("Non-Refundable Tokens: 10")).toBeTruthy();
  });

  it("renders the token menu", () => {
    renderComponent();

    expect(screen.getByTestId("token-menu")).toBeTruthy();
    expect(screen.getByTestId("token-menu-open").textContent).toBe("false");
  });

  it("opens the token menu when the token balance is clicked", () => {
    renderComponent();

    const tokenContainer = document.querySelector('[data-tour="esign-1"]');

    fireEvent.click(tokenContainer);

    expect(props.setTokenAnchor).toHaveBeenCalledWith(tokenContainer);
  });

  it("passes the token anchor to ViewTokenMenu", () => {
    const anchor = document.createElement("div");

    renderComponent({
      tokenAnchor: anchor,
    });

    expect(screen.getByTestId("token-menu-open").textContent).toBe("true");

    expect(screen.getByTestId("token-menu-anchor").textContent).toBe(
      "anchored",
    );
  });

  it("closes the token menu by resetting the anchor", () => {
    renderComponent({
      tokenAnchor: document.createElement("div"),
    });

    fireEvent.click(screen.getByRole("button", { name: "Close Token Menu" }));

    expect(props.setTokenAnchor).toHaveBeenCalledWith(null);
  });

  it("renders the upload document component", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: "Upload Document" }),
    ).toBeTruthy();
  });

  it("disables document upload on smaller form factors", () => {
    renderComponent({
      ltMediumFormFactor: true,
    });

    expect(screen.getByTestId("upload-document").disabled).toBe(true);
  });

  it("enables document upload on larger form factors", () => {
    renderComponent({
      ltMediumFormFactor: false,
    });

    expect(screen.getByTestId("upload-document").disabled).toBe(false);
  });

  it("passes getEditablePdfDocument to the upload component", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("upload-document"));

    expect(props.getEditablePdfDocument).toHaveBeenCalledOnce();
  });

  it("renders the Prepare Esign button", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: "Prepare Esign" })).toBeTruthy();
  });

  it("enables Prepare Esign when a file and fields are provided", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: "Prepare Esign" }).disabled).toBe(
      false,
    );
  });

  it("disables Prepare Esign when no file is provided", () => {
    renderComponent({
      file: null,
    });

    expect(screen.getByRole("button", { name: "Prepare Esign" }).disabled).toBe(
      true,
    );
  });

  it("disables Prepare Esign when there are no fields", () => {
    renderComponent({
      fields: [],
    });

    expect(screen.getByRole("button", { name: "Prepare Esign" }).disabled).toBe(
      true,
    );
  });

  it("disables Prepare Esign when both file and fields are missing", () => {
    renderComponent({
      file: null,
      fields: [],
    });

    expect(screen.getByRole("button", { name: "Prepare Esign" }).disabled).toBe(
      true,
    );
  });

  it("calls handlePrepareEsign with the selected document ID", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Prepare Esign" }));

    expect(props.handlePrepareEsign).toHaveBeenCalledWith("document-123");
  });

  it("generates a UUID when no document is selected", () => {
    renderComponent({
      selectedEsignDocument: null,
    });

    fireEvent.click(screen.getByRole("button", { name: "Prepare Esign" }));

    expect(uuidv4Mock).toHaveBeenCalledOnce();

    expect(props.handlePrepareEsign).toHaveBeenCalledWith("generated-uuid");
  });

  it("generates a UUID when the selected document has no ID", () => {
    renderComponent({
      selectedEsignDocument: {},
    });

    fireEvent.click(screen.getByRole("button", { name: "Prepare Esign" }));

    expect(props.handlePrepareEsign).toHaveBeenCalledWith("generated-uuid");
  });

  it("passes the loading state to the Prepare Esign button", () => {
    renderComponent({
      isCreateEsignDocumentLoading: true,
    });

    expect(
      screen.getByRole("button", { name: "Prepare Esign" }).dataset.loading,
    ).toBe("true");
  });

  it("renders a skeleton while loading valid tokens", () => {
    const { container } = renderComponent({
      isLoadingValidTokensForETSS: true,
    });

    expect(container.querySelector(".MuiSkeleton-root")).toBeTruthy();

    expect(screen.queryByRole("button", { name: "Prepare Esign" })).toBeNull();

    expect(screen.queryByText(/Non-Refundable Tokens/)).toBeNull();
  });
});
