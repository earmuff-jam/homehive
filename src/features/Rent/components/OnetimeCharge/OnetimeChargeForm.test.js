import React from "react";

import OnetimeChargeForm from "./OnetimeChargeForm";
import { render, screen } from "@testing-library/react";

// simple mock for RHF register
const mockRegister = jest.fn((name) => ({
  name,
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ref: jest.fn(),
}));

describe("OnetimeChargeForm Unit Tests", () => {
  describe("OnetimeChargeForm Snapshot tests", () => {
    it("matches AddProperty snapshot", () => {
      const { asFragment } = render(
        <OnetimeChargeForm register={mockRegister} errors={{}} />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("OnetimeChargeForm Component tests", () => {
    it("calls register with correct validation rules", () => {
      render(<OnetimeChargeForm register={mockRegister} errors={{}} />);

      expect(mockRegister).toHaveBeenCalledWith(
        "amount",
        expect.objectContaining({
          required: expect.any(String),
          pattern: expect.any(Object),
        }),
      );

      expect(mockRegister).toHaveBeenCalledWith(
        "note",
        expect.objectContaining({
          required: expect.any(String),
          minLength: expect.any(Object),
          maxLength: expect.any(Object),
        }),
      );
    });

    it("displays validation errors", () => {
      const errors = {
        amount: { message: "Invalid amount" },
        note: { message: "Invalid note" },
      };

      render(<OnetimeChargeForm register={mockRegister} errors={errors} />);

      expect(screen.getByText("Invalid amount")).toBeInTheDocument();
      expect(screen.getByText("Invalid note")).toBeInTheDocument();
    });
  });
});
