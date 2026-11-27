import React from "react";

import PdfDocumentReviewBox from "./PdfDocumentReviewBox";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("PdfDocumentReviewBox", () => {
  it("renders a success alert when valid and success message is provided", () => {
    render(
      <PdfDocumentReviewBox isValid successStr="PDF document is valid." />,
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("PDF document is valid.")).toBeTruthy();
  });

  it("renders an error alert when invalid", () => {
    render(
      <PdfDocumentReviewBox isValid={false} errorStr="Invalid PDF document." />,
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Invalid PDF document.")).toBeTruthy();
  });

  it("does not render an alert when valid and no success message is provided", () => {
    render(<PdfDocumentReviewBox />);

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not render a success alert when success message is empty", () => {
    render(<PdfDocumentReviewBox isValid={true} successStr="" />);

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("uses the default isValid value of true", () => {
    render(<PdfDocumentReviewBox successStr="Document is ready." />);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Document is ready.")).toBeTruthy();
  });

  it("uses the default errorStr value when invalid and no error message is provided", () => {
    render(<PdfDocumentReviewBox isValid={false} />);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe("");
  });

  it("does not render the error message when valid", () => {
    render(
      <PdfDocumentReviewBox
        isValid
        errorStr="This should not appear."
        successStr="Everything looks good."
      />,
    );

    expect(screen.queryByText("This should not appear.")).toBeNull();
    expect(screen.getByText("Everything looks good.")).toBeTruthy();
  });

  it("does not render the success message when invalid", () => {
    render(
      <PdfDocumentReviewBox
        isValid={false}
        errorStr="Something went wrong."
        successStr="This should not appear."
      />,
    );

    expect(screen.queryByText("This should not appear.")).toBeNull();
    expect(screen.getByText("Something went wrong.")).toBeTruthy();
  });
});
