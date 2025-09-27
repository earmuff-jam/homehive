import { retrieveTourKey } from "./utils";

describe("retrieveTourKey tests", () => {
  describe("validate retrieveTourKey function behavior", () => {
    it("returns dynamic mapping when currentUri matches /property/:id pattern", () => {
      const currentUri = "/property/dc7cca7d-dd4e-448c-ac4b-d2e853b749d8";
      const result = retrieveTourKey(currentUri, "property");
      expect(result).toBe("/property/:id");
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
      const currentUri = "/user/property/123";
      const result = retrieveTourKey(currentUri, "property");
      expect(result).toBe("/user/property/123"); // not dynamic because segment[1] !== 'property'
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
});
