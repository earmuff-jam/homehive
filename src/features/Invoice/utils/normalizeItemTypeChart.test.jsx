import { normalizeItemTypeChart } from "features/Invoice/utils/normalizeItemTypeChart";
import { describe, expect, it } from "vitest";

describe("normalizeItemTypeChart", () => {
  it("counts item categories correctly", () => {
    const input = [
      {
        lineItems: [
          { category: { label: "Rent" } },
          { category: { label: "Rent" } },
          { category: { label: "Utilities" } },
        ],
      },
    ];

    const result = normalizeItemTypeChart(input);

    expect(result.labels).toEqual(["Rent", "Utilities"]);
    expect(result.datasets[0].data).toEqual([2, 1]);
  });

  it("handles missing categories", () => {
    const input = [{ lineItems: [{}] }];

    const result = normalizeItemTypeChart(input);

    expect(result.labels).toEqual(["Unknown Item"]);
    expect(result.datasets[0].data).toEqual([1]);
  });
});
