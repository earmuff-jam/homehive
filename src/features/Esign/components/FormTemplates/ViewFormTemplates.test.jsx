import React from "react";

import ViewFormTemplates, {
  DEFAULT_PDF_FORM_TEMPLATE_OPTIONS,
} from "./ViewFormTemplates";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { getPreprocessedFile } from "features/Esign/utils/getPreprocessedFile";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("features/Esign/utils/getPreprocessedFile", () => ({
  getPreprocessedFile: vi.fn(),
}));

vi.mock("common/AIconButton", () => ({
  default: ({ onClick }) => (
    <button aria-label="Remove" onClick={onClick}>
      Remove
    </button>
  ),
}));

describe("ViewFormTemplates", () => {
  let handleUpload;
  let handleRemove;
  let savedOptions;
  let readableFile;

  beforeEach(() => {
    vi.clearAllMocks();

    handleUpload = vi.fn();
    handleRemove = vi.fn();

    savedOptions = [];

    readableFile = new File(["PDF content"], "document.pdf", {
      type: "application/pdf",
    });

    getPreprocessedFile.mockResolvedValue(readableFile);
  });

  const renderComponent = (props = {}) => {
    return render(
      <ViewFormTemplates
        savedOptions={savedOptions}
        handleUpload={handleUpload}
        handleRemove={handleRemove}
        {...props}
      />,
    );
  };

  const openAutocomplete = () => {
    const input = screen.getByPlaceholderText("Select a form to edit ...");

    fireEvent.mouseDown(input);

    return input;
  };

  it("renders the document information section", () => {
    renderComponent();

    expect(screen.getByText("Edit Form Fields")).toBeTruthy();
    expect(screen.getByText("Document Information")).toBeTruthy();
    expect(screen.getByText("Select Document *")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Select a form to edit ..."),
    ).toBeTruthy();
  });

  it("renders all default PDF form templates", () => {
    renderComponent();

    openAutocomplete();

    DEFAULT_PDF_FORM_TEMPLATE_OPTIONS.forEach((template) => {
      expect(
        screen.getByRole("option", {
          name: template.name,
          exact: true,
        }),
      ).toBeTruthy();
    });
  });

  it("renders saved templates alongside default templates", () => {
    savedOptions = [
      {
        id: "saved_1",
        name: "Custom Lease",
        fileName: "custom-lease.pdf",
        filePath: "/saved/custom-lease.pdf",
      },
    ];

    renderComponent();

    openAutocomplete();

    expect(screen.getByRole("option", { name: /^Custom Lease/ })).toBeTruthy();

    expect(
      screen.getByRole("option", {
        name: "Lease Agreement",
        exact: true,
      }),
    ).toBeTruthy();
  });

  it("selects a default template and preprocesses its PDF", async () => {
    renderComponent();

    openAutocomplete();

    fireEvent.click(
      screen.getByRole("option", {
        name: "Lease Agreement",
        exact: true,
      }),
    );

    await waitFor(() => {
      expect(getPreprocessedFile).toHaveBeenCalledWith(
        "/forms/residential-lease.pdf",
        "lease-agreement.pdf",
      );
    });

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalledWith({
        target: {
          files: [readableFile],
        },
        savedFields: [],
        signatureBoxes: [],
        signers: [],
      });
    });
  });

  it("selects a saved template and passes its metadata to handleUpload", async () => {
    const savedTemplate = {
      id: "saved_1",
      name: "Custom Lease",
      fileName: "custom-lease.pdf",
      filePath: "/saved/custom-lease.pdf",
      fields: [{ name: "tenantName", value: "John" }],
      signatureBoxes: [{ fieldType: "signature" }],
      signers: [{ id: "tenant_1" }],
    };

    savedOptions = [savedTemplate];

    renderComponent();

    openAutocomplete();

    fireEvent.click(screen.getByRole("option", { name: /^Custom Lease/ }));

    expect(getPreprocessedFile).toHaveBeenCalledWith(
      "/saved/custom-lease.pdf",
      "custom-lease.pdf",
    );

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalledWith({
        target: {
          files: [readableFile],
        },
        savedFields: savedTemplate.fields,
        signatureBoxes: savedTemplate.signatureBoxes,
        signers: savedTemplate.signers,
      });
    });
  });

  it("uses empty metadata arrays when saved template metadata is missing", async () => {
    savedOptions = [
      {
        id: "saved_2",
        name: "Basic Template",
        fileName: "basic.pdf",
        filePath: "/saved/basic.pdf",
      },
    ];

    renderComponent();

    openAutocomplete();

    fireEvent.click(screen.getByRole("option", { name: /^Basic Template/ }));

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalledWith({
        target: {
          files: [readableFile],
        },
        savedFields: [],
        signatureBoxes: [],
        signers: [],
      });
    });
  });

  it("clears the selected template and calls handleUpload with null", async () => {
    renderComponent();

    openAutocomplete();

    fireEvent.click(
      screen.getByRole("option", {
        name: "Lease Agreement",
        exact: true,
      }),
    );

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalledOnce();
    });

    const clearButton = screen.getByTitle("Clear");

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(handleUpload).toHaveBeenLastCalledWith({
        target: {
          files: [null],
        },
      });
    });
  });

  it("removes a saved template when its remove button is clicked", () => {
    savedOptions = [
      {
        id: "saved_1",
        name: "Custom Lease",
        fileName: "custom-lease.pdf",
        filePath: "/saved/custom-lease.pdf",
      },
    ];

    renderComponent();

    openAutocomplete();

    const option = screen.getByRole("option", {
      name: /^Custom Lease/,
    });

    fireEvent.click(
      within(option).getByRole("button", {
        name: "Remove",
      }),
    );

    expect(handleRemove).toHaveBeenCalledWith("saved_1");
    expect(handleUpload).not.toHaveBeenCalled();
  });

  it("does not render remove buttons for default templates", () => {
    renderComponent();

    openAutocomplete();

    const option = screen.getByRole("option", {
      name: "Lease Agreement",
      exact: true,
    });

    expect(within(option).queryByRole("button", { name: "Remove" })).toBeNull();
  });

  it("does not preprocess a file when the selection is cleared", async () => {
    renderComponent();

    openAutocomplete();

    fireEvent.click(
      screen.getByRole("option", {
        name: "Lease Agreement",
        exact: true,
      }),
    );

    await waitFor(() => {
      expect(getPreprocessedFile).toHaveBeenCalledOnce();
    });

    fireEvent.click(screen.getByTitle("Clear"));

    expect(getPreprocessedFile).toHaveBeenCalledOnce();
  });
});
