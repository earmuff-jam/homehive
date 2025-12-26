import React from "react";

import { useForm } from "react-hook-form";

import AddProperty from "./AddProperty";
import { render, screen } from "@testing-library/react";

const mockRegister = () => ({});
const mockErrors = {};
const mockSubmit = jest.fn();

// Mock the common components used inside
jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

const AddPropertyWrapper = () => {
  const methods = useForm();

  return (
    <AddProperty
      register={methods.register}
      control={methods.control}
      errors={methods.formState.errors}
      onSubmit={jest.fn()}
    />
  );
};

describe("AddProperty Component Tests", () => {
  describe("AddProperty Snapshot Tests", () => {
    it("matches AddProperty snapshot", () => {
      const { asFragment } = render(<AddPropertyWrapper />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("AddProperty Component Tests", () => {
    it("renders without crashing", () => {
      render(<AddPropertyWrapper />);

      expect(
        screen.getByPlaceholderText("Name of your property"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("123 Main St")).toBeInTheDocument();
    });
  });
});
