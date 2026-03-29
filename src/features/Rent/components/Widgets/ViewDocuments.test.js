import React from "react";

import ViewDocuments from "./ViewDocuments";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { lightTheme } from "src/Theme";

const renderComponent = (label = "Documents", caption = "All uploaded files") =>
  render(
    <ThemeProvider theme={lightTheme}>
      <ViewDocuments label={label} caption={caption} />
    </ThemeProvider>,
  );

describe("ViewDocuments Jest Tests", () => {
  describe("ViewDocuments Snapshot Tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = renderComponent();
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("ViewDocuments Component Tests", () => {
    it("renders header title and caption", () => {
      renderComponent("Documents", "All uploaded files");

      expect(screen.getByText("Documents")).toBeInTheDocument();
      expect(screen.getByText("All uploaded files")).toBeInTheDocument();
    });

    it("renders table headers", () => {
      renderComponent();

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Attachment Filename")).toBeInTheDocument();
      expect(screen.getByText("Last updated")).toBeInTheDocument();
    });

    it("shows empty state when no data", () => {
      renderComponent();

      expect(
        screen.getByText("Create templates to begin."),
      ).toBeInTheDocument();
    });
  });
});
