import React from "react";

import UserInfoViewer from "./UserInfoViewer";
import { render, screen } from "@testing-library/react";

describe("UserInfoViewer component", () => {
  const mockRegister = jest.fn(() => ({}));
  const mockErrors = {};
  const mockSubmit = jest.fn();

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
