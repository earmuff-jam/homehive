import React from "react";

import { useForm } from "react-hook-form";

import OnetimeChargeForm from "./OnetimeChargeForm";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// simple mock for RHF register spy
const mockRegister = vi.fn((name) => ({
  name,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
}));

// test wrapper to provide real RHF context
const renderWithForm = (ui) => {
  const Wrapper = () => {
    const methods = useForm({
      defaultValues: {
        paymentMethod: "card",
        amount: 0,
        note: "",
      },
    });

    return React.cloneElement(ui, {
      control: methods.control,
      register: mockRegister,
      errors: {},
    });
  };

  return render(<Wrapper />);
};

describe("OnetimeChargeForm Unit Tests", () => {
  describe("Snapshot tests", () => {
    it("matches snapshot", () => {
      const { asFragment } = renderWithForm(<OnetimeChargeForm />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Component tests", () => {
    it("calls register with correct validation rules", () => {
      renderWithForm(<OnetimeChargeForm />);

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

    it("renders payment method toggle", () => {
      renderWithForm(<OnetimeChargeForm />);

      expect(screen.getByText("Credit Card (Instant)")).toBeInTheDocument();
      expect(
        screen.getByText("Bank Transfer (Upto 3 business days)"),
      ).toBeInTheDocument();
    });
  });
});
