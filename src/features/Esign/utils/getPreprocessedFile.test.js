import { getPreprocessedFile } from "./getPreprocessedFile";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getPreprocessedFile", () => {
  let mockBlob;

  beforeEach(() => {
    mockBlob = new Blob(["PDF content"], {
      type: "application/pdf",
    });

    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(mockBlob),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the provided URL", async () => {
    await getPreprocessedFile(
      "https://example.com/document.pdf",
      "document.pdf",
    );

    expect(fetch).toHaveBeenCalledWith("https://example.com/document.pdf");
  });

  it("converts the response into a blob", async () => {
    const blobMock = vi.fn().mockResolvedValue(mockBlob);

    global.fetch = vi.fn().mockResolvedValue({
      blob: blobMock,
    });

    await getPreprocessedFile(
      "https://example.com/document.pdf",
      "document.pdf",
    );

    expect(blobMock).toHaveBeenCalledOnce();
  });

  it("returns a File with the provided filename", async () => {
    const result = await getPreprocessedFile(
      "https://example.com/document.pdf",
      "document.pdf",
    );

    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe("document.pdf");
  });

  it("returns a PDF file with the correct MIME type", async () => {
    const result = await getPreprocessedFile(
      "https://example.com/document.pdf",
      "document.pdf",
    );

    expect(result.type).toBe("application/pdf");
  });

  it("preserves the blob content", async () => {
    const result = await getPreprocessedFile(
      "https://example.com/document.pdf",
      "document.pdf",
    );

    expect(await result.text()).toBe("PDF content");
  });

  it("works with different filenames", async () => {
    const result = await getPreprocessedFile(
      "https://example.com/document.pdf",
      "rental-agreement.pdf",
    );

    expect(result.name).toBe("rental-agreement.pdf");
  });
});
