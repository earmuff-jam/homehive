// useCalculateFinancialHealth.test.js
import { useCalculateFinancialHealth } from "./useCalculateFinancialHealth";
import { describe, expect, it } from "vitest";

describe("useCalculateFinancialHealth", () => {
  it("calculates financial health metrics", () => {
    const properties = [
      {
        rent: 1000,
        additionalRent: 100,
        securityDeposit: 500,
        sqFt: 1000,
      },
      {
        rent: 2000,
        additionalRent: 200,
        securityDeposit: 1000,
        sqFt: 2000,
      },
    ];

    expect(useCalculateFinancialHealth(properties)).toEqual({
      totalMonthlyRentalIncome: 3300,
      averageRentPerSqFt: 1.1,
      securityDepositsCollected: 1500,
    });
  });

  it("returns zeros when no properties are provided", () => {
    expect(useCalculateFinancialHealth([])).toEqual({
      totalMonthlyRentalIncome: 0,
      averageRentPerSqFt: 0,
      securityDepositsCollected: 0,
    });
  });
});
