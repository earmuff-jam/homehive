import React from "react";

import TitleCard from "./TitleCard";
import { Typography } from "@mui/material";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("TitleCard", () => {
  const mockProps = {
    title: "Test Title",
    subtitle: "This is a subtitle",
    icon: <Typography data-testid="test-icon">🔔</Typography>,
    chipLabels: ["Chip 1", "Chip 2"],
  };

  it("renders title, subtitle, icon, and chips", () => {
    render(<TitleCard {...mockProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("This is a subtitle")).toBeInTheDocument();

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Chip 1")).toBeInTheDocument();
    expect(screen.getByText("Chip 2")).toBeInTheDocument();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<TitleCard />);
    expect(asFragment()).toMatchSnapshot();
  });
});
