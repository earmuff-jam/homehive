import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the Reset button", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  it("renders Add Widget button", () => {
    render(<Dashboard />);
    expect(screen.getByRole("button", { name: /Add Widget/i })).toBeInTheDocument();
  });
});
