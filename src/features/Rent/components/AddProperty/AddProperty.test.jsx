import React from "react";

import { useForm } from "react-hook-form";

import AddProperty from "./AddProperty";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const AddPropertyWrapper = () => {
  const methods = useForm();

  return (
    <AddProperty
      register={methods.register}
      control={methods.control}
      errors={methods.formState.errors}
      onSubmit={vi.fn()}
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
