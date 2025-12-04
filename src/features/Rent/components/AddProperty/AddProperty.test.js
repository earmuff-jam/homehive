import React from "react";

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

describe("AddProperty Component Tests", () => {
  describe("AddProperty Snapshot Tests", () => {
    it("matches AddProperty snapshot", () => {
      const { asFragment } = render(
        <AddProperty
          register={jest.fn(() => ({}))}
          errors={{}}
          onSubmit={jest.fn()}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("AddProperty Component Tests", () => {
    it("renders without crashing", () => {
      render(
        <AddProperty
          register={mockRegister}
          errors={mockErrors}
          onSubmit={mockSubmit}
        />,
      );

      expect(
        screen.getByPlaceholderText("Name of your property"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("123 Main St")).toBeInTheDocument();
    });
  });
});
