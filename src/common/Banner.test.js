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
  fetchLoggedInUser: jest.fn(),
}));

jest.mock("features/Api/firebaseUserApi", () => ({
  useUpdateUserByUidMutation: jest.fn(() => [
    jest.fn(),
    {
      isSuccess: false,
      isLoading: false,
    },
  ]),
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
        screen.getByText(
          /We’ll log you out so you can sign back in and confirm your account./i,
        ),
      ).toBeInTheDocument();
    });

    it("does not render banner when isBasePlanUser returns false", () => {
      useLocation.mockReturnValue({ pathname: "/dashboard" });
      isBasePlanUser.mockReturnValue(false);

      render(<Banner />);

      expect(
        screen.queryByText(
          /We’ll log you out so you can sign back in and confirm your account./i,
        ),
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
