import getFinalFormData from "./getFinalFormData";
import getSigningFields from "./getSigningFields";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./getSigningFields", () => ({
  default: vi.fn(),
}));

describe("getFinalFormData", () => {
  const finalBytes = new Uint8Array([1, 2, 3, 4]);

  const signatureBoxes = [
    {
      fieldType: "signature",
      signerId: "creator",
      pageNum: 1,
      pdfX: 100,
      pdfY: 200,
      pdfW: 150,
      pdfH: 50,
    },
  ];

  const signers = [
    {
      name: "John Doe",
      email: "john@example.com",
    },
  ];

  const user = {
    uid: "user-123",
    email: "owner@example.com",
  };

  const mockFormFields = [
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
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns a FormData instance", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result).toBeInstanceOf(FormData);
  });

  it("appends the PDF file with the correct filename and MIME type", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    const file = result.get("file");

    expect(file).toBeInstanceOf(Blob);
    expect(file.name).toBe("prepared-esign.pdf");
    expect(file.type).toBe("application/pdf");
  });

  it("preserves the PDF file contents", async () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    const file = result.get("file");

    expect(new Uint8Array(await file.arrayBuffer())).toEqual(finalBytes);
  });

  it("appends the correct function URL and method", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result.get("fUrl")).toBe("0029_SendPreparedEsignDocument");
    expect(result.get("fMethod")).toBe("POST");
  });

  it("appends the correct document title and subject", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result.get("title")).toBe("Lease agreement");
    expect(result.get("subject")).toBe("Requesting electronic signature");
  });

  it("appends the signers as JSON", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result.get("signers")).toBe(JSON.stringify(signers));
    expect(JSON.parse(result.get("signers"))).toEqual(signers);
  });

  it("appends the user information", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result.get("userId")).toBe("user-123");
    expect(result.get("stripeCustomerEmail")).toBe("owner@example.com");
  });

  it("appends the signing message", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result.get("message")).toBe(
      "Please review and sign the provided document at your earliest convenience",
    );
  });

  it("calls getSigningFields with the provided signature boxes", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(getSigningFields).toHaveBeenCalledWith(signatureBoxes);
  });

  it("appends the generated signing fields as JSON", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(finalBytes, signatureBoxes, signers, user);

    expect(result.get("formFieldsPerDocument")).toBe(
      JSON.stringify(mockFormFields),
    );

    expect(JSON.parse(result.get("formFieldsPerDocument"))).toEqual(
      mockFormFields,
    );
  });

  it("handles empty signature boxes", () => {
    getSigningFields.mockReturnValue(undefined);

    const result = getFinalFormData(finalBytes, [], signers, user);

    expect(result.get("formFieldsPerDocument")).toBe("undefined");
  });

  it("handles missing user information", () => {
    getSigningFields.mockReturnValue(mockFormFields);

    const result = getFinalFormData(
      finalBytes,
      signatureBoxes,
      signers,
      undefined,
    );

    expect(result.get("userId")).toBe("undefined");
    expect(result.get("stripeCustomerEmail")).toBe("undefined");
  });
});
