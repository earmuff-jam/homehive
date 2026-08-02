import React from "react";

import UserInfoViewer from "./UserInfoViewer";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("common/TextFieldWithLabel", () => ({
  __esModule: true,
  default: ({ label, id, placeholder, errorMsg }) => (
    <div data-testid={id}>
      <label>{label}</label>
      <input placeholder={placeholder} />
      {errorMsg && <span>{errorMsg}</span>}
    </div>
  ),
}));

describe("UserInfoViewer component", () => {
  const mockRegister = vi.fn(() => ({}));
  const mockErrors = {};
  const mockSubmit = vi.fn();

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <UserInfoViewer
        title="Sender Information"
        caption="Add details about the sender"
        register={mockRegister}
        errors={mockErrors}
        isDisabled={false}
        onSubmit={mockSubmit}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders title and caption text", () => {
    render(
      <UserInfoViewer
        title="Sender Information"
        caption="Add details about the sender"
        register={mockRegister}
        errors={mockErrors}
        isDisabled={false}
        onSubmit={mockSubmit}
      />,
    );

    expect(screen.getByText("Sender Information")).toBeInTheDocument();
    expect(
      screen.getByText("Add details about the sender"),
    ).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});
