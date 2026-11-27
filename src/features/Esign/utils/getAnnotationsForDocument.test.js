import getAnnotationsForDocument from "./getAnnotationsForDocument";
import { DEFAULT_TEXT_SIZE, SCALE } from "features/Esign/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("getAnnotationsForDocument", () => {
  let newFields;
  let setFields;
  let pdfFormFields;
  let pageDiv;
  let container;
  let viewport;

  beforeEach(() => {
    newFields = [];
    setFields = vi.fn();
    pdfFormFields = [];
    pageDiv = document.createElement("div");
    container = document.createElement("div");
    viewport = { height: 800 };
  });

  const buildAnnotation = (overrides = {}) => ({
    id: "annotation-1",
    subtype: "Widget",
    fieldType: "Tx",
    fieldName: "testField",
    fieldValue: "",
    rect: [10, 20, 110, 50],
    ...overrides,
  });

  const renderAnnotations = (annotations, pageNumber = 1) => {
    getAnnotationsForDocument(
      annotations,
      newFields,
      setFields,
      pdfFormFields,
      {
        pageNumber,
        viewport,
        pageDiv,
        container,
      },
    );
  };

  it("ignores annotations that are not widgets", () => {
    renderAnnotations([buildAnnotation({ subtype: "Text" })]);

    expect(pageDiv.children).toHaveLength(0);
    expect(newFields).toHaveLength(0);
  });

  it("ignores unsupported field types", () => {
    renderAnnotations([buildAnnotation({ fieldType: "Sig" })]);

    expect(pageDiv.children).toHaveLength(0);
    expect(newFields).toHaveLength(0);
  });

  it("creates a text input for Tx annotations", () => {
    renderAnnotations([buildAnnotation()]);

    const input = pageDiv.querySelector("input");

    expect(input).toBeTruthy();
    expect(input.type).toBe("text");
    expect(input.value).toBe("");
    expect(newFields).toEqual([
      {
        name: "testField",
        value: "",
        type: "text",
      },
    ]);
    expect(container.contains(pageDiv)).toBe(true);
  });

  it("creates a date input for date annotations", () => {
    renderAnnotations([
      buildAnnotation({
        datetimeType: "date",
        fieldValue: "11/26/2026",
      }),
    ]);

    const input = pageDiv.querySelector("input");

    expect(input.type).toBe("date");
    expect(input.value).toBe("2026-11-26");
  });

  it("creates a textarea for multiline annotations", () => {
    renderAnnotations([
      buildAnnotation({
        mutiLine: true,
        fieldValue: "Multiple lines",
      }),
    ]);

    const textarea = pageDiv.querySelector("textarea");

    expect(textarea).toBeTruthy();
    expect(textarea.value).toBe("Multiple lines");
    expect(textarea.style.resize).toBe("none");
  });

  it("applies the correct position and dimensions", () => {
    renderAnnotations([buildAnnotation()]);

    const input = pageDiv.querySelector("input");

    expect(input.style.position).toBe("absolute");
    expect(input.style.left).toBe(`${10 * SCALE}px`);
    expect(input.style.top).toBe(`${viewport.height - 50 * SCALE}px`);
    expect(input.style.width).toBe(`${100 * SCALE}px`);
    expect(input.style.height).toBe(`${30 * SCALE}px`);
    expect(input.style.fontSize).toBe(`${DEFAULT_TEXT_SIZE}px`);
  });

  it("updates fields when a text input changes", () => {
    renderAnnotations([buildAnnotation()]);

    const input = pageDiv.querySelector("input");

    input.value = "Updated value";
    input.dispatchEvent(new Event("input"));

    expect(setFields).toHaveBeenCalled();

    const updater = setFields.mock.calls[0][0];
    const result = updater([]);

    expect(result).toEqual([
      {
        name: "testField",
        value: "Updated value",
        type: "text",
      },
    ]);
  });

  it("updates an existing text field instead of adding another", () => {
    renderAnnotations([buildAnnotation()]);

    const input = pageDiv.querySelector("input");

    input.value = "Updated";
    input.dispatchEvent(new Event("input"));

    const updater = setFields.mock.calls[0][0];

    const result = updater([
      { name: "testField", value: "Old value", type: "text" },
    ]);

    expect(result).toEqual([
      { name: "testField", value: "Updated", type: "text" },
    ]);
    expect(result).toHaveLength(1);
  });

  it("formats date values before updating fields", () => {
    renderAnnotations([
      buildAnnotation({
        datetimeType: "date",
      }),
    ]);

    const input = pageDiv.querySelector("input");

    input.value = "2026-11-26";
    input.dispatchEvent(new Event("input"));

    const updater = setFields.mock.calls[0][0];

    expect(updater([])).toEqual([
      {
        name: "testField",
        value: "11/26/2026",
        type: "text",
      },
    ]);
  });

  it("creates a checkbox for non-radio Btn annotations", () => {
    renderAnnotations([
      buildAnnotation({
        fieldType: "Btn",
        fieldValue: "Yes",
      }),
    ]);

    const checkbox = pageDiv.querySelector("input");

    expect(checkbox.type).toBe("checkbox");
    expect(checkbox.checked).toBe(true);
    expect(newFields[0]).toMatchObject({
      name: "testField",
      type: "checkbox",
      value: "Yes",
      pageNumber: 1,
    });
  });

  it("uses saved checkbox values when available", () => {
    pdfFormFields = [
      {
        name: "testField",
        type: "checkbox",
        value: "Off",
        pageNumber: 1,
      },
    ];

    renderAnnotations([
      buildAnnotation({
        fieldType: "Btn",
        fieldValue: "Yes",
      }),
    ]);

    const checkbox = pageDiv.querySelector("input");

    expect(checkbox.checked).toBe(false);
    expect(newFields[0].value).toBe("Off");
  });

  it("creates an unchecked checkbox when fieldValue is Off", () => {
    renderAnnotations([
      buildAnnotation({
        fieldType: "Btn",
        fieldValue: "Off",
      }),
    ]);

    const checkbox = pageDiv.querySelector("input");

    expect(checkbox.checked).toBe(false);
  });

  it("does not create inputs for radio buttons", () => {
    renderAnnotations([
      buildAnnotation({
        fieldType: "Btn",
        radioButton: true,
      }),
    ]);

    expect(pageDiv.children).toHaveLength(0);
    expect(newFields).toHaveLength(0);
  });

  it("generates a fallback field name when fieldName is missing", () => {
    renderAnnotations([
      buildAnnotation({
        fieldName: undefined,
        id: "fallback-id",
      }),
    ]);

    expect(newFields[0].name).toBe("field_1_fallback-id");
  });
});
