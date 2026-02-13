import React from "react";

import Salutation from "./Salutation";
import { render, screen } from "@testing-library/react";

describe("Salutation component", () => {
  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    streetAddress: "123 Main St",
    city: "Austin",
    state: "TX",
    zipcode: "78701",
  };

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<Salutation userInfo={mockUser} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders 'To,' by default", () => {
    render(<Salutation userInfo={mockUser} />);
    expect(screen.getByText("To,")).toBeInTheDocument();
  });

  it("renders 'Thank you,' when isEnd=true", () => {
    render(<Salutation userInfo={mockUser} isEnd />);
    expect(screen.getByText("Thank you,")).toBeInTheDocument();
  });

  it("renders all user info fields correctly", () => {
    render(<Salutation userInfo={mockUser} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Austin TX, 78701")).toBeInTheDocument();
  });
});
