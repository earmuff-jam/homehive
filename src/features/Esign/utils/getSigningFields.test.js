import getSigningFields from "./getSigningFields";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("getSigningFields", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns undefined when formFields is empty", () => {
    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    const result = getSigningFields([]);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unable to generate signature boxes",
    );
  });

  it("returns undefined when no formFields are provided", () => {
    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    expect(getSigningFields()).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledOnce();
  });

  it("creates a signature field for the creator", () => {
    const result = getSigningFields([
      {
        fieldType: "signature",
        signerId: "creator",
        pageNum: 1,
        pdfX: 100,
        pdfY: 200,
        pdfW: 150,
        pdfH: 50,
      },
    ]);

    expect(result).toEqual([
      {
        document_index: 0,
        api_id: "sig_0",
        type: "signature",
        signer: 0,
        page: 1,
        x: 100,
        y: 200,
        width: 150,
        height: 50,
        required: true,
      },
    ]);
  });

  it("creates a date field when fieldType is date", () => {
    const result = getSigningFields([
      {
        fieldType: "date",
        signerId: "creator",
        pageNum: 2,
        pdfX: 50,
        pdfY: 100,
        pdfW: 120,
        pdfH: 30,
      },
    ]);

    expect(result[0].type).toBe("date");
  });

  it("creates a signature field for non-date field types", () => {
    const result = getSigningFields([
      {
        fieldType: "signature",
        signerId: "creator",
      },
      {
        fieldType: "text",
        signerId: "creator",
      },
      {
        fieldType: "initials",
        signerId: "creator",
      },
    ]);

    expect(result.map((field) => field.type)).toEqual([
      "signature",
      "signature",
      "signature",
    ]);
  });

  it("extracts the tenant number from signerId", () => {
    const result = getSigningFields([
      {
        fieldType: "signature",
        signerId: "tenant_1",
      },
      {
        fieldType: "signature",
        signerId: "tenant_2",
      },
      {
        fieldType: "signature",
        signerId: "tenant_3",
      },
    ]);

    expect(result.map((field) => field.signer)).toEqual([1, 2, 3]);
  });

  it("generates unique api_id values for multiple fields", () => {
    const result = getSigningFields([
      { fieldType: "signature", signerId: "creator" },
      { fieldType: "signature", signerId: "tenant_1" },
      { fieldType: "date", signerId: "tenant_2" },
    ]);

    expect(result.map((field) => field.api_id)).toEqual([
      "sig_0",
      "sig_1",
      "sig_2",
    ]);
  });

  it("preserves page numbers and PDF coordinates", () => {
    const result = getSigningFields([
      {
        fieldType: "signature",
        signerId: "tenant_1",
        pageNum: 3,
        pdfX: 125,
        pdfY: 250,
        pdfW: 175,
        pdfH: 65,
      },
    ]);

    expect(result[0]).toMatchObject({
      page: 3,
      x: 125,
      y: 250,
      width: 175,
      height: 65,
    });
  });

  it("marks every generated field as required", () => {
    const result = getSigningFields([
      { fieldType: "signature", signerId: "creator" },
      { fieldType: "date", signerId: "tenant_1" },
    ]);

    expect(result.every((field) => field.required)).toBe(true);
  });

  it("sets document_index to zero for every field", () => {
    const result = getSigningFields([
      { fieldType: "signature", signerId: "creator" },
      { fieldType: "signature", signerId: "tenant_1" },
    ]);

    expect(result.every((field) => field.document_index === 0)).toBe(true);
  });
});
