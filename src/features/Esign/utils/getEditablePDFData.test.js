import { getEditablePDFData } from "./getEditablePDFData";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { loadMock, rgbMock } = vi.hoisted(() => ({
  loadMock: vi.fn(),
  rgbMock: vi.fn((r, g, b) => ({ r, g, b })),
}));

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    load: loadMock,
  },
  rgb: rgbMock,
}));

describe("getEditablePDFData", () => {
  let file;
  let pdfDoc;
  let form;
  let pages;
  let page;
  let textField;
  let checkboxField;

  beforeEach(() => {
    vi.clearAllMocks();

    textField = {
      setText: vi.fn(),
    };

    checkboxField = {
      check: vi.fn(),
      uncheck: vi.fn(),
    };

    page = {
      drawRectangle: vi.fn(),
      drawLine: vi.fn(),
    };

    pages = [page];

    form = {
      getTextField: vi.fn().mockReturnValue(textField),
      getCheckBox: vi.fn().mockReturnValue(checkboxField),
      remove: vi.fn(),
    };

    pdfDoc = {
      getForm: vi.fn().mockReturnValue(form),
      getPages: vi.fn().mockReturnValue(pages),
      save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    };

    file = {
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    };

    loadMock.mockResolvedValue(pdfDoc);
  });

  it("returns null when no file is provided", async () => {
    const result = await getEditablePDFData(null);

    expect(result).toBeNull();
    expect(loadMock).not.toHaveBeenCalled();
  });

  it("loads the PDF and returns editable PDF data", async () => {
    const result = await getEditablePDFData(file);

    expect(file.arrayBuffer).toHaveBeenCalledOnce();
    expect(loadMock).toHaveBeenCalledOnce();
    expect(pdfDoc.getForm).toHaveBeenCalledOnce();
    expect(pdfDoc.getPages).toHaveBeenCalledOnce();
    expect(pdfDoc.save).toHaveBeenCalledOnce();

    expect(result).toEqual({
      pdfDoc,
      form,
      formBytes: new Uint8Array([1, 2, 3]),
    });
  });

  it("populates text fields", async () => {
    const fields = [
      {
        name: "firstName",
        value: "John",
        type: "text",
      },
      {
        name: "lastName",
        value: "Doe",
        type: "text",
      },
    ];

    await getEditablePDFData(file, fields);

    expect(form.getTextField).toHaveBeenCalledTimes(2);
    expect(form.getTextField).toHaveBeenCalledWith("firstName");
    expect(form.getTextField).toHaveBeenCalledWith("lastName");

    expect(textField.setText).toHaveBeenCalledWith("John");
    expect(textField.setText).toHaveBeenCalledWith("Doe");
  });

  it("sets empty string when a text field has no value", async () => {
    await getEditablePDFData(file, [
      {
        name: "firstName",
        type: "text",
      },
    ]);

    expect(textField.setText).toHaveBeenCalledWith("");
  });

  it("ignores text fields that cannot be populated", async () => {
    form.getTextField.mockImplementation(() => {
      throw new Error("Field not found");
    });

    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    await expect(
      getEditablePDFData(file, [
        {
          name: "missingField",
          value: "John",
          type: "text",
        },
      ]),
    ).resolves.toBeTruthy();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("checks a checkbox with Yes value", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Yes",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(form.getCheckBox).toHaveBeenCalledWith("agree");
    expect(form.remove).toHaveBeenCalledWith(checkboxField);
    expect(page.drawRectangle).toHaveBeenCalledOnce();
    expect(page.drawLine).toHaveBeenCalledTimes(2);
  });

  it("checks a checkbox with On value", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "On",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(page.drawLine).toHaveBeenCalledTimes(2);
  });

  it("draws an unchecked checkbox without X marks", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Off",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(page.drawRectangle).toHaveBeenCalledOnce();
    expect(page.drawLine).not.toHaveBeenCalled();
    expect(form.remove).toHaveBeenCalledWith(checkboxField);
  });

  it("draws a rectangle with the correct dimensions and position", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Yes",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(page.drawRectangle).toHaveBeenCalledWith({
      x: 10,
      y: 20,
      width: 10,
      height: 10,
      borderColor: { r: 0, g: 0, b: 0 },
      borderWidth: 1,
      color: { r: 0, g: 0, b: 0 },
    });
  });

  it("draws both lines of an X for checked checkboxes", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Yes",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(page.drawLine).toHaveBeenNthCalledWith(1, {
      start: { x: 12, y: 22 },
      end: { x: 18, y: 28 },
      thickness: 1,
      color: { r: 0, g: 0, b: 0 },
    });

    expect(page.drawLine).toHaveBeenNthCalledWith(2, {
      start: { x: 18, y: 22 },
      end: { x: 12, y: 28 },
      thickness: 1,
      color: { r: 0, g: 0, b: 0 },
    });
  });

  it("does not draw checkboxes when shouldDrawCheckboxes is false", async () => {
    await getEditablePDFData(
      file,
      [
        {
          name: "agree",
          value: "Yes",
          type: "checkbox",
          pageNum: 1,
          rect: [10, 20, 30, 40],
        },
      ],
      false,
    );

    expect(page.drawRectangle).not.toHaveBeenCalled();
    expect(page.drawLine).not.toHaveBeenCalled();

    expect(form.getCheckBox).toHaveBeenCalledWith("agree");
    expect(form.remove).toHaveBeenCalledWith(checkboxField);
  });

  it("skips checkboxes with invalid page numbers", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Yes",
        type: "checkbox",
        pageNum: 2,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(page.drawRectangle).not.toHaveBeenCalled();
    expect(form.getCheckBox).not.toHaveBeenCalled();
    expect(form.remove).not.toHaveBeenCalled();
  });

  it("skips checkboxes with page number zero", async () => {
    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Yes",
        type: "checkbox",
        pageNum: 0,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(page.drawRectangle).not.toHaveBeenCalled();
  });

  it("ignores checkbox fields that cannot be removed", async () => {
    form.getCheckBox.mockImplementation(() => {
      throw new Error("Checkbox not found");
    });

    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    await expect(
      getEditablePDFData(file, [
        {
          name: "agree",
          value: "Yes",
          type: "checkbox",
          pageNum: 1,
          rect: [10, 20, 30, 40],
        },
      ]),
    ).resolves.toBeTruthy();

    expect(page.drawRectangle).toHaveBeenCalledOnce();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("falls back to AcroForm checkbox handling when drawing fails", async () => {
    page.drawRectangle.mockImplementation(() => {
      throw new Error("Unable to draw checkbox");
    });

    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Yes",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(checkboxField.check).toHaveBeenCalledOnce();
    expect(checkboxField.uncheck).not.toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("unchecks the AcroForm checkbox when fallback value is Off", async () => {
    page.drawRectangle.mockImplementation(() => {
      throw new Error("Unable to draw checkbox");
    });

    const consoleSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    await getEditablePDFData(file, [
      {
        name: "agree",
        value: "Off",
        type: "checkbox",
        pageNum: 1,
        rect: [10, 20, 30, 40],
      },
    ]);

    expect(checkboxField.uncheck).toHaveBeenCalledOnce();
    expect(checkboxField.check).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("does not process fields of unrelated types", async () => {
    await getEditablePDFData(file, [
      {
        name: "signature",
        value: "John",
        type: "signature",
      },
    ]);

    expect(form.getTextField).not.toHaveBeenCalled();
    expect(form.getCheckBox).not.toHaveBeenCalled();
    expect(page.drawRectangle).not.toHaveBeenCalled();
  });

  it("handles an empty fields array", async () => {
    const result = await getEditablePDFData(file);

    expect(form.getTextField).not.toHaveBeenCalled();
    expect(form.getCheckBox).not.toHaveBeenCalled();
    expect(result.formBytes).toEqual(new Uint8Array([1, 2, 3]));
  });
});
