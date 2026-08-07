// useCalculateProjectedRentalChange.test.js
import { useCalculateProjectedRentalChange } from "./useCalculateProjectedRentalChange";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/utils", () => ({
  ManualRentStatusEnumValue: "manual",
  CompleteRentStatusEnumValue: "complete",
  PaidRentStatusEnumValue: "paid",
}));

describe("useCalculateProjectedRentalChange", () => {
  it("returns projected rental change", () => {
    const rents = [
      {
        createdOn: "2023-01-01",
        rentAmount: 12000,
        status: "paid",
      },
      {
        createdOn: "2024-01-01",
        rentAmount: 15000,
        status: "paid",
      },
    ];

    expect(useCalculateProjectedRentalChange(rents, 1000, 2)).toEqual({
      labels: [2023, 2024, 2025, 2026],
      historical: [12000, 15000, null, null],
      forecast: [null, null, 17500, 20000],
    });
  });

  it("returns empty data when there are no valid rents", () => {
    expect(useCalculateProjectedRentalChange([], 500)).toEqual({
      labels: [],
      historical: [],
      forecast: [],
    });
  });
});
