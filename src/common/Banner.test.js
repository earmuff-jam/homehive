import React from "react";

import { useLocation } from "react-router-dom";

import Banner from "./Banner";
import { render, screen } from "@testing-library/react";
import { isBannerVisible } from "common/utils";

describe("Banner Jest Tests", () => {
  describe("Banner Component Tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders banner when isBannerVisible returns true", () => {
      useLocation.mockReturnValue({ pathname: "/dashboard" });
      isBannerVisible.mockReturnValue(true);

      render(<Banner />);

      expect(
        screen.getByText(/you are currently using a demo account/i),
      ).toBeInTheDocument();
    });

    it("does not render banner when isBannerVisible returns false", () => {
      useLocation.mockReturnValue({ pathname: "/dashboard" });
      isBannerVisible.mockReturnValue(false);

      render(<Banner />);

      expect(
        screen.queryByText(/you are currently using a demo account/i),
      ).not.toBeInTheDocument();
    });
  });
  describe("Banner Snapshot tests", () => {
    it("should render the correct snapshot", () => {
      const { asFragment } = render(<Banner />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
