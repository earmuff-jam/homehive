import React from "react";

import Review from "./Review";
import { render, screen } from "@testing-library/react";

describe("Review tests", () => {
  describe("snapshot tests", () => {
    it("matches snapshot", () => {
      const { asFragment } = render(<Review />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("component behavior tests", () => {
    test("renders all review titles", () => {
      render(<Review />);

      expect(
        screen.getByText(
          "Been using it for a couple of months, and hands down I simply love how its super customizable.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Love the look and feel of the app. The automatic system managing email notifications is top tier.",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Now I don't have to waste time creating new invoices everytime. Super helpful love it. 10 by 10 would recommend.",
        ),
      ).toBeInTheDocument();
    });

    test("renders correct number of review cards", () => {
      const { container } = render(<Review />);

      const cards = container.querySelectorAll(".MuiCard-root");
      expect(cards.length).toBe(3);
    });

    test("renders images with correct alt text", () => {
      render(<Review />);

      const images = screen.getAllByAltText("Image of the person");
      expect(images.length).toBe(3);
    });
  });
});
