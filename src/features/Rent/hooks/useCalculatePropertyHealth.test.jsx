// useCalculatePropertyHealth.test.js
import { useCalculatePropertyHealth } from "./useCalculatePropertyHealth";
import { describe, expect, it } from "vitest";

describe("useCalculatePropertyHealth", () => {
  it("calculates total and vacant properties", () => {
    const properties = [
      { rentee: ["tenant1"] },
      { rentee: [] },
      { rentee: [] },
    ];

    expect(useCalculatePropertyHealth(properties)).toEqual({
      totalProperties: 3,
      vacantProperties: 2,
    });
  });

  it("returns zero values when no properties exist", () => {
    expect(useCalculatePropertyHealth([])).toEqual({
      totalProperties: 0,
      vacantProperties: 0,
    });
  });
});
