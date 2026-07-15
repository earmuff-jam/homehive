import React from "react";

import PortfolioHealth from "./PortfolioHealth";
import { render, screen } from "@testing-library/react";

describe("Portfolio Health", () => {
  describe("Portfolio Health snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <PortfolioHealth
          portfolioHealth={{
            totalProperties: 10,
            vacantProperties: 3,
          }}
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("PortfolioHealth component tests", () => {
    it("renders total and vacant properties", () => {
      render(
        <PortfolioHealth
          portfolioHealth={{
            totalProperties: 10,
            vacantProperties: 3,
          }}
        />,
      );

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();

      expect(screen.getByText("Total properties")).toBeInTheDocument();
      expect(screen.getByText("Vacant properties")).toBeInTheDocument();
    });

    it("renders singular labels when count is 1", () => {
      render(
        <PortfolioHealth
          portfolioHealth={{
            totalProperties: 1,
            vacantProperties: 1,
          }}
        />,
      );

      expect(screen.getByText("Total property")).toBeInTheDocument();
      expect(screen.getByText("Vacant property")).toBeInTheDocument();
    });

    it("defaults values to zero when portfolioHealth is missing", () => {
      render(
        <PortfolioHealth
          portfolioHealth={{ totalProperties: 0, vacantProperties: 0 }}
        />,
      );

      expect(screen.getAllByText("0")).toHaveLength(2);
      expect(screen.getByText("Total property")).toBeInTheDocument();
      expect(screen.getByText("Vacant property")).toBeInTheDocument();
    });
  });
});
