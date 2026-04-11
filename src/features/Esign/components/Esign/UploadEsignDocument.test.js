// UploadEsignDocument.test.jsx
import React from "react";

import UploadEsignDocument from "./UploadEsignDocument";
import { fireEvent, render, screen } from "@testing-library/react";

describe("UploadEsignDocument Component Tests", () => {
  let handleUploadMock;

  beforeEach(() => {
    handleUploadMock = jest.fn();
  });

  describe("UploadEsignDocument Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { asFragment } = render(
        <UploadEsignDocument handleUpload={handleUploadMock} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("UploadEsignDocument Interaction Tests", () => {
    it("calls handleUpload when a file is selected", () => {
      render(<UploadEsignDocument handleUpload={handleUploadMock} />);

      const file = new File(["dummy content"], "dummy.pdf", {
        type: "application/pdf",
      });
      const input =
        screen.getByLabelText(/Upload files/i) ||
        screen.getByRole("textbox", { hidden: true });

      // fireEvent.change for input
      fireEvent.change(input, { target: { files: [file] } });

      expect(handleUploadMock).toHaveBeenCalledTimes(1);
    });
  });

  it("renders upload button", () => {
    render(<UploadEsignDocument handleUpload={handleUploadMock} />);
    expect(screen.getByText(/Upload files/i)).toBeInTheDocument();
  });
});
