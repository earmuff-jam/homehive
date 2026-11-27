import React from "react";

import ViewPlacedFields from "./ViewPlacedFields";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ViewPlacedFields", () => {
  const signatureBoxes = [
    {
      id: "field-1",
      signerRole: "Creator",
      fieldType: "Signature",
      pageNum: 1,
      color: "#0E7C6B",
    },
    {
      id: "field-2",
      signerRole: "Tenant",
      fieldType: "Date",
      pageNum: 2,
      color: "#3D4B72",
    },
  ];

  it("renders the Placed Fields heading", () => {
    render(<ViewPlacedFields />);

    expect(screen.getByText("Placed Fields")).toBeTruthy();
  });

  it("renders no chips when signatureBoxes is empty", () => {
    const { container } = render(
      <ViewPlacedFields signatureBoxes={[]} removeBox={vi.fn()} />,
    );

    expect(container.querySelectorAll(".MuiChip-root")).toHaveLength(0);
  });

  it("renders no chips when signatureBoxes is not provided", () => {
    const { container } = render(<ViewPlacedFields />);

    expect(container.querySelectorAll(".MuiChip-root")).toHaveLength(0);
  });

  it("renders all placed fields", () => {
    render(
      <ViewPlacedFields signatureBoxes={signatureBoxes} removeBox={vi.fn()} />,
    );

    expect(screen.getByText("Creator Signature — Page 1")).toBeTruthy();
    expect(screen.getByText("Tenant Date — Page 2")).toBeTruthy();
  });

  it("renders the correct number of chips", () => {
    const { container } = render(
      <ViewPlacedFields signatureBoxes={signatureBoxes} removeBox={vi.fn()} />,
    );

    expect(container.querySelectorAll(".MuiChip-root")).toHaveLength(2);
  });

  it("applies the field color to each chip", () => {
    const { container } = render(
      <ViewPlacedFields signatureBoxes={signatureBoxes} removeBox={vi.fn()} />,
    );

    const chips = container.querySelectorAll(".MuiChip-root");

    expect(chips[0]).toHaveStyle({
      borderColor: "#0E7C6B",
      color: "#0E7C6B",
    });

    expect(chips[1]).toHaveStyle({
      borderColor: "#3D4B72",
      color: "#3D4B72",
    });
  });

  it("uses small chip size", () => {
    const { container } = render(
      <ViewPlacedFields signatureBoxes={signatureBoxes} removeBox={vi.fn()} />,
    );

    const chips = container.querySelectorAll(".MuiChip-root");

    chips.forEach((chip) => {
      expect(chip.classList.contains("MuiChip-sizeSmall")).toBe(true);
    });
  });

  it("calls removeBox with the correct field ID when a chip is deleted", () => {
    const removeBox = vi.fn();

    render(
      <ViewPlacedFields
        signatureBoxes={signatureBoxes}
        removeBox={removeBox}
      />,
    );

    const deleteIcons = screen.getAllByTestId("CancelIcon");

    fireEvent.click(deleteIcons[0]);

    expect(removeBox).toHaveBeenCalledOnce();
    expect(removeBox).toHaveBeenCalledWith("field-1");
  });

  it("removes the correct field when another chip is deleted", () => {
    const removeBox = vi.fn();

    render(
      <ViewPlacedFields
        signatureBoxes={signatureBoxes}
        removeBox={removeBox}
      />,
    );

    const deleteIcons = screen.getAllByTestId("CancelIcon");

    fireEvent.click(deleteIcons[1]);

    expect(removeBox).toHaveBeenCalledOnce();
    expect(removeBox).toHaveBeenCalledWith("field-2");
  });
});
