import React from "react";

import StatsAccordionDetailsBlock from "./StatsAccordionDetailsBlock";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";

const renderWithTheme = (ui) => {
  return render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);
};

describe("StatsAccordionDetailsBlock tests", () => {
  describe("StatsAccordionDetailsBlock snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <StatsAccordionDetailsBlock
          label="test label"
          value={"Some value"}
          caption="Some caption"
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <StatsAccordionDetailsBlock
          label="test label"
          value={"Some value"}
          caption="Some caption"
          applyVariant
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("StatsAccordionDetailsBlock", () => {
    it("renders label, value, and caption", () => {
      renderWithTheme(
        <StatsAccordionDetailsBlock
          label="Occupancy Rate"
          value="95%"
          caption="Last 30 days"
        />,
      );

      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("95%")).toBeInTheDocument();
      expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    });
  });
});
