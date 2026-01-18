import React from "react";

import Footer from "./Footer";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Footer component", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("renders footer text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Earmuffjam LLC. All rights reserved. @2024/i),
    ).toBeInTheDocument();
  });
});
