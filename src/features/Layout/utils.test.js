import { buildValidRoutes, retrieveTourKey } from "./utils";
import { isValidFeatureFlagsForRoutes } from "common/ApplicationConfig";

jest.mock("common/ApplicationConfig", () => ({
  isValidFeatureFlagsForRoutes: jest.fn(),
  authorizedServerLevelFeatureFlags: () =>
    new Map([
      ["analytics", true],
      ["invoicer", true],
      ["invoicerPro", false],
      ["userInformation", true],
      ["sendEmail", true],
    ]),
}));

describe("retrieveTourKey tests", () => {
  describe("validate retrieveTourKey function behavior", () => {
    it("returns dynamic mapping when currentUri matches /rent/property/:id pattern", () => {
      const currentUri = "/rent/property/dc7cca7d-dd4e-448c-ac4b-d2e853b749d8";
      const result = retrieveTourKey(currentUri, "property");
      expect(result).toBe("/rent/property/:id");
    });

    it("returns original uri when path starts with expectedStrValue but no id", () => {
      const currentUri = "/property"; // no /id part
      const result = retrieveTourKey(currentUri, "property");
      expect(result).toBe("/property");
    });

    it("returns original uri when path does not include expectedStrValue", () => {
      const currentUri = "/tenant/123";
      const result = retrieveTourKey(currentUri, "property");
      expect(result).toBe("/tenant/123");
    });

    it("returns dynamic mapping only if expectedStrValue is in correct segment", () => {
      const currentUri = "/invoice/view";
      const result = retrieveTourKey(currentUri, "property");
      expect(result).toBe("/invoice/view");

      const updatedCurrentUri =
        "/rent/property/dc7cca7d-dd4e-448c-ac4b-d2e853b749d8";
      const updatedResult = retrieveTourKey(updatedCurrentUri, "property");
      expect(updatedResult).toBe("/rent/property/:id");
    });

    it("handles unexpected empty currentUri gracefully", () => {
      const result = retrieveTourKey("", "property");
      expect(result).toBe("");
    });

    it("handles non-matching expectedStrValue", () => {
      const currentUri = "/property/dc7cca7d-dd4e-448c-ac4b-d2e853b749d8";
      const result = retrieveTourKey(currentUri, "tenant");
      expect(result).toBe(currentUri);
    });
  });
  describe("validate function behavior", () => {
    describe("buildValidRoutes", () => {
      const baseUser = {
        uid: "123",
        role: "admin",
      };

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("returns routes when everything is valid", () => {
        isValidFeatureFlagsForRoutes.mockReturnValue(true);

        const routes = [
          {
            requiredFlags: ["analytics"],
            config: {
              enabledForRoles: ["admin"],
              isLoggedInFeature: true,
            },
          },
        ];

        const result = buildValidRoutes(routes, baseUser);

        expect(result).toHaveLength(1);
      });

      it("filters out route when feature flags invalid", () => {
        isValidFeatureFlagsForRoutes.mockReturnValue(false);

        const routes = [
          {
            requiredFlags: ["invoicerPro"],
            config: {},
          },
        ];

        const result = buildValidRoutes(routes, baseUser);

        expect(result).toHaveLength(0);
      });

      it("filters out route when role not allowed", () => {
        isValidFeatureFlagsForRoutes.mockReturnValue(true);

        const routes = [
          {
            requiredFlags: [],
            config: {
              enabledForRoles: ["manager"],
            },
          },
        ];

        const result = buildValidRoutes(routes, baseUser);

        expect(result).toHaveLength(0);
      });

      it("filters out route when login required but user not logged in", () => {
        isValidFeatureFlagsForRoutes.mockReturnValue(true);

        const routes = [
          {
            requiredFlags: [],
            config: {
              isLoggedInFeature: true,
            },
          },
        ];

        const result = buildValidRoutes(routes, null);

        expect(result).toHaveLength(0);
      });

      it("allows route when no restrictions", () => {
        isValidFeatureFlagsForRoutes.mockReturnValue(true);

        const routes = [
          {
            requiredFlags: [],
            config: {},
          },
        ];

        const result = buildValidRoutes(routes, null);

        expect(result).toHaveLength(1);
      });
    });
  });
});
