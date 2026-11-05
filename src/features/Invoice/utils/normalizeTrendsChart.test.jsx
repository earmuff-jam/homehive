import InvoiceMockValues from "features/Invoice/mockConstants";
import { normalizeTrendsChart } from "features/Invoice/utils/normalizeTrendsChart";
import { describe, expect, it } from "vitest";

describe("normalizeTrendsChart", () => {
  it("builds collected and tax datasets per month", () => {
    const result = normalizeTrendsChart(
      InvoiceMockValues.utils.trendsChartReq,
      "bar",
    );

    expect(result.labels).toEqual(["January"]);
    expect(result.datasets[0].data).toEqual([150]); // collected
    expect(result.datasets[1].data).toEqual([15]); // tax
  });

  it("returns empty datasets when input is empty", () => {
    const result = normalizeTrendsChart([]);

    expect(result.labels).toEqual([]);
    expect(result.datasets[0].data).toEqual([]);
    expect(result.datasets[1].data).toEqual([]);
  });
});
