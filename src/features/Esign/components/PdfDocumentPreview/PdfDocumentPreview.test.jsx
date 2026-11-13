import React from "react";

import PdfDocumentPreview from "./PdfDocumentPreview";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { ESIGN_DOCUMENT_PREVIEW_WIDTH } from "features/Esign/constants";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  getDocumentMock,
  getPageMock,
  getViewportMock,
  renderMock,
  destroyMock,
} = vi.hoisted(() => ({
  getDocumentMock: vi.fn(),
  getPageMock: vi.fn(),
  getViewportMock: vi.fn(),
  renderMock: vi.fn(),
  destroyMock: vi.fn(),
}));

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: {
    workerSrc: null,
  },
  getDocument: getDocumentMock,
}));

vi.mock("pdfjs-dist/build/pdf.worker.min?url", () => ({
  default: "mock-pdf-worker",
}));

describe("PdfDocumentPreview", () => {
  let file;
  let pdf;
  let page;
  let canvasContext;

  beforeEach(() => {
    vi.clearAllMocks();

    canvasContext = {};

    file = {
      size: 1024 * 1024 * 2.5,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    };

    page = {
      getViewport: getViewportMock,
      render: renderMock,
    };

    pdf = {
      getPage: getPageMock,
      destroy: destroyMock,
    };

    getDocumentMock.mockReturnValue({
      promise: Promise.resolve(pdf),
    });

    getPageMock.mockResolvedValue(page);

    getViewportMock.mockImplementation(({ scale }) => ({
      width: 600 * scale,
      height: 800 * scale,
    }));

    renderMock.mockReturnValue({
      promise: Promise.resolve(),
    });

    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 1,
    });

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn().mockReturnValue(canvasContext),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders nothing when no file is provided", () => {
    const { container } = render(
      <PdfDocumentPreview data={null} isLoading={false} />,
    );

    expect(container.firstChild).toBeNull();
    expect(getDocumentMock).not.toHaveBeenCalled();
  });

  it("renders the loading indicator while loading", () => {
    render(<PdfDocumentPreview data={{ file }} isLoading={true} />);

    expect(screen.getByText("Loading Preview")).toBeTruthy();
    expect(document.querySelector(".MuiCircularProgress-root")).toBeTruthy();

    expect(getDocumentMock).not.toHaveBeenCalled();
    expect(file.arrayBuffer).not.toHaveBeenCalled();
  });

  it("renders the canvas and file size when a file is provided", () => {
    const { container } = render(
      <PdfDocumentPreview data={{ file }} isLoading={false} />,
    );

    expect(container.querySelector("canvas")).toBeTruthy();
    expect(screen.getByText("Size: 2.50 MB")).toBeTruthy();
  });

  it("loads the PDF using the file array buffer", async () => {
    render(<PdfDocumentPreview data={{ file }} isLoading={false} />);

    await waitFor(() => {
      expect(getDocumentMock).toHaveBeenCalledWith({
        data: expect.any(ArrayBuffer),
      });
    });

    expect(file.arrayBuffer).toHaveBeenCalledOnce();
  });

  it("renders the first page of the PDF", async () => {
    render(<PdfDocumentPreview data={{ file }} isLoading={false} />);

    await waitFor(() => {
      expect(getPageMock).toHaveBeenCalledWith(1);
      expect(renderMock).toHaveBeenCalledOnce();
    });
  });

  it("uses the expected scale to fit the preview width", async () => {
    render(<PdfDocumentPreview data={{ file }} isLoading={false} />);

    await waitFor(() => {
      expect(getViewportMock).toHaveBeenCalledTimes(2);
    });

    expect(getViewportMock).toHaveBeenNthCalledWith(1, {
      scale: 1,
    });

    expect(getViewportMock).toHaveBeenNthCalledWith(2, {
      scale: ESIGN_DOCUMENT_PREVIEW_WIDTH / 600,
    });
  });

  it("accounts for device pixel ratio when rendering", async () => {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 2,
    });

    render(<PdfDocumentPreview data={{ file }} isLoading={false} />);

    await waitFor(() => {
      expect(getViewportMock).toHaveBeenCalledTimes(2);
    });

    expect(getViewportMock).toHaveBeenNthCalledWith(2, {
      scale: (ESIGN_DOCUMENT_PREVIEW_WIDTH / 600) * 2,
    });
  });

  it("sets the canvas dimensions and display width", async () => {
    const { container } = render(
      <PdfDocumentPreview data={{ file }} isLoading={false} />,
    );

    const canvas = container.querySelector("canvas");

    await waitFor(() => {
      expect(renderMock).toHaveBeenCalledOnce();
      expect(canvas.width).toBe(ESIGN_DOCUMENT_PREVIEW_WIDTH);
    });

    expect(canvas.style.width).toBe(`${ESIGN_DOCUMENT_PREVIEW_WIDTH}px`);
  });

  it("passes the canvas context and viewport to PDF rendering", async () => {
    const { container } = render(
      <PdfDocumentPreview data={{ file }} isLoading={false} />,
    );

    await waitFor(() => {
      expect(renderMock).toHaveBeenCalledOnce();
    });

    const canvas = container.querySelector("canvas");

    expect(renderMock).toHaveBeenCalledWith({
      canvasContext,
      viewport: {
        width: ESIGN_DOCUMENT_PREVIEW_WIDTH,
        height: (800 / 600) * ESIGN_DOCUMENT_PREVIEW_WIDTH,
      },
    });

    expect(canvas.getContext).toBeDefined();
  });

  it("destroys the PDF when the component unmounts", async () => {
    const { unmount } = render(
      <PdfDocumentPreview data={{ file }} isLoading={false} />,
    );

    await waitFor(() => {
      expect(getPageMock).toHaveBeenCalledWith(1);
    });

    unmount();

    expect(destroyMock).toHaveBeenCalledOnce();
  });

  it("does not load the PDF while loading", () => {
    render(<PdfDocumentPreview data={{ file }} isLoading={true} />);

    expect(getDocumentMock).not.toHaveBeenCalled();
  });

  it("handles PDF loading errors", async () => {
    const error = new Error("Unable to load PDF");

    getDocumentMock.mockReturnValue({
      promise: Promise.reject(error),
    });

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    render(<PdfDocumentPreview data={{ file }} isLoading={false} />);

    await waitFor(() => {
      expect(debugSpy).toHaveBeenCalledWith("Unable to render preview.", error);
    });
  });

  it("handles PDF page retrieval errors", async () => {
    const error = new Error("Unable to retrieve PDF page");

    getPageMock.mockRejectedValue(error);

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    render(<PdfDocumentPreview data={{ file }} isLoading={false} />);

    await waitFor(() => {
      expect(debugSpy).toHaveBeenCalledWith("Unable to render preview.", error);
    });
  });
});
