import React from "react";

import { useLocation } from "react-router-dom";

import Banner from "./Banner";
import { render, screen } from "@testing-library/react";
import { isBasePlanUser } from "common/utils";

// mock react-router
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

// mock util
jest.mock("common/utils", () => ({
  isBasePlanUser: jest.fn(),
}));

describe("Banner Jest Tests", () => {
  describe("Banner Component Tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders banner when isBasePlanUser returns true", () => {
      useLocation.mockReturnValue({ pathname: "/dashboard" });
      isBasePlanUser.mockReturnValue(true);

      render(<Banner />);

      expect(
        screen.getByText(/you are currently using a demo account/i),
      ).toBeInTheDocument();
    });

    it("does not render banner when isBasePlanUser returns false", () => {
      useLocation.mockReturnValue({ pathname: "/dashboard" });
      isBasePlanUser.mockReturnValue(false);

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
