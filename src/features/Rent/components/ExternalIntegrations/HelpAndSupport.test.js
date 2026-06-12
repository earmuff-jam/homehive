import React from "react";

import HelpAndSupport from "./HelpAndSupport";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("common/RowHeader", () => (props) => (
  <div data-testid="row-header">{props.title}</div>
));

jest.mock("common/AButton", () => (props) => (
  <button onClick={props.onClick}>{props.label}</button>
));

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
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => {});

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
