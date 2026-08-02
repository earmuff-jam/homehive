import React from "react";

import HelpAndSupport from "./HelpAndSupport";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("common/RowHeader", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="row-header">{title}</div>,
}));

describe("HelpAndSupport", () => {
  const options = [
    {
      id: "1",
      title: "Support",
      caption: "Get help",
      buttonText: "Open",
      to: "https://example.com",
      icon: <span data-testid="icon" />,
    },
  ];

  it("renders options correctly", () => {
    render(<HelpAndSupport options={options} />);

    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Get help")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("opens link on button click", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => {});

    render(<HelpAndSupport options={options} />);

    fireEvent.click(screen.getByText("Open"));

    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noopener,noreferrer",
    );

    openSpy.mockRestore();
  });

  it("matches snapshot", () => {
    const { container } = render(<HelpAndSupport options={options} />);

    expect(container).toMatchSnapshot();
  });
});
