import * as utils from "./utils";
import { render, screen } from "@testing-library/react";
import { fetchLoggedInUser } from "common/utils";

jest.mock("react-secure-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("common/utils", () => {
  const actual = jest.requireActual("common/utils");
  return {
    ...actual,
    fetchLoggedInUser: jest.fn(),
  };
});

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

  describe("isBasePlanUser function tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("returns true if user has no role and path includes MainRentAppRouteUri", () => {
      fetchLoggedInUser.mockReturnValue({});
      expect(utils.isBasePlanUser("/rent/properties")).toBe(true);
    });

    it("returns false if path does not include MainRentAppRouteUri", () => {
      fetchLoggedInUser.mockReturnValue({});
      expect(utils.isBasePlanUser("/invoice/dashboard")).toBe(false);
    });
  });
});
