import React from "react";

import EditSigners from "./EditSigners";
import { render, screen } from "@testing-library/react";

describe("EditSigners Tests", () => {
  describe("EditSigners Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <EditSigners
          setEdit={jest.fn()}
          signers={[
            {
              role: "Creator",
              name: "Jane Smith",
              email_address: "jane_doe47@gmail.com",
            },
          ]}
          role="Creator"
          updateSignerDetails={jest.fn()}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
  describe("EditSigners Component Tests", () => {
    const mockUpdate = jest.fn();
    const mockSetEdit = jest.fn();

    const signers = [
      {
        role: "Creator",
        name: "Jane Smith",
        email_address: "jane_doe47@gmail.com",
      },
    ];

    it("renders form fields with prefilled values", () => {
      render(
        <EditSigners
          setEdit={mockSetEdit}
          signers={signers}
          role="Creator"
          updateSignerDetails={mockUpdate}
        />,
      );

      expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("jane_doe47@gmail.com"),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/the name of the signer/i),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/the email address of the signer/i),
      ).toBeInTheDocument();
    });
  });
});
