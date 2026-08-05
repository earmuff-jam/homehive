// useCalculateTotalCollectedRents.test.js
import { useCalculateTotalCollectedRents } from "./useCalculateTotalCollectedRents";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/utils", () => ({
  ManualRentStatusEnumValue: "manual",
  CompleteRentStatusEnumValue: "complete",
  PaidRentStatusEnumValue: "paid",
}));

describe("useCalculateTotalCollectedRents", () => {
  it("calculates total collected rents by property", () => {
    const properties = [
      { id: "1", name: "Property A" },
      { id: "2", name: "Property B" },
    ];

    const rents = [
      {
        propertyId: "1",
        rentAmount: 1000,
        status: "paid",
      },
      {
        propertyId: "1",
        rentAmount: 500,
        status: "manual",
      },
      {
        propertyId: "2",
        rentAmount: 2000,
        status: "complete",
      },
      {
        propertyId: "2",
        rentAmount: 999,
        status: "pending", // ignored
      },
    ];

    expect(useCalculateTotalCollectedRents(properties, rents)).toEqual([
      ["Property A", "Property B"],
      [1500, 2000],
      ["rgba(153, 102, 255, 0.7)", "rgba(255, 99, 132, 0.7)"],
    ]);
  });

  it("returns empty arrays when no properties or rents exist", () => {
    expect(useCalculateTotalCollectedRents([], [])).toEqual([[], [], []]);
  });
});
