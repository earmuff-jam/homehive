import React from "react";

import AccessBadge from "./AccessBadge";
import { render, screen } from "@testing-library/react";

describe("AccessBadge Tests", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<AccessBadge />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders sign-in required text", () => {
    render(<AccessBadge />);

    expect(screen.getByText(/sign in required/i)).toBeInTheDocument();
  });

  it("renders status indicator dot", () => {
    const { container } = render(<AccessBadge />);

    const dot = container.querySelector("div div");
    expect(dot).toBeTruthy();
  });
});
