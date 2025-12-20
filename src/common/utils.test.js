import React from "react";

import secureLocalStorage from "react-secure-storage";

import * as utils from "./utils";
import { render, screen } from "@testing-library/react";
import { fetchLoggedInUser } from "features/Rent/utils";

// Mock secureLocalStorage
jest.mock("react-secure-storage", () => ({
  getItem: jest.fn(),
}));

// Mock fetchLoggedInUser
jest.mock("features/Rent/utils", () => ({
  fetchLoggedInUser: jest.fn(),
}));

describe("Utils function tests", () => {
  describe("pluralize function tests", () => {
    it("returns singular when array length <= 1", () => {
      expect(utils.pluralize(0, "cat")).toBe("cat");
      expect(utils.pluralize(1, "dog")).toBe("dog");
    });

    it("returns plural when array length > 1", () => {
      expect(utils.pluralize(2, "cat")).toBe("cats");
      expect(utils.pluralize(5, "dog")).toBe("dogs");
    });
  });

  describe("createHelperSentences function tests", () => {
    it("renders a Typography component with the correct text", () => {
      render(utils.createHelperSentences("click", "the button"));
      expect(
        screen.getByText(
          /This help \/ guide is designed to aide you in learning how to/i,
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/click the button/i)).toBeInTheDocument();
    });
  });

  describe("isUserLoggedIn function tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("returns true if user exists with uid", () => {
      secureLocalStorage.getItem.mockReturnValue({ uid: "123" });
      expect(utils.isUserLoggedIn()).toBe(true);
    });

    it("returns false if no user or no uid", () => {
      secureLocalStorage.getItem.mockReturnValue(null);
      expect(utils.isUserLoggedIn()).toBe(false);

      secureLocalStorage.getItem.mockReturnValue({});
      expect(utils.isUserLoggedIn()).toBe(false);
    });
  });

  describe("isBannerVisible function tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("returns true if user has no role and path includes MainRentAppRouteUri", () => {
      fetchLoggedInUser.mockReturnValue({});
      expect(utils.isBannerVisible("/rent/properties")).toBe(true);
    });

    it("returns false if user has a role", () => {
      fetchLoggedInUser.mockReturnValue({ role: "tenant" });
      expect(utils.isBannerVisible("/rent/properties")).toBe(false);
    });

    it("returns false if path does not include MainRentAppRouteUri", () => {
      fetchLoggedInUser.mockReturnValue({});
      expect(utils.isBannerVisible("/invoice/dashboard")).toBe(false);
    });
  });
});
