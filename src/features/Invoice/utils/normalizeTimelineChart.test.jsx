import { normalizeTimelineChart } from "features/Invoice/utils/normalizeTimelineChart";
import { describe, expect, it } from "vitest";

describe("normalizeTimelineChart", () => {
  it("builds timeline dataset correctly", () => {
    const input = [
      {
        startDate: "2025-01-01",
        endDate: "2025-01-10",
        lineItems: [{ payment: 100, paymentMethod: "Card" }],
      },
      {
        startDate: "2025-02-01",
        endDate: "2025-02-05",
        lineItems: [{ payment: 50, paymentMethod: "Cash" }],
      },
    ];

    const result = normalizeTimelineChart(input);

    expect(result.datasets).toHaveLength(2);

    expect(result.datasets[0].data.length).toEqual(1);
    expect(result.datasets[0].data[0].duration).toEqual(9);
    expect(result.datasets[0].data[0].y).toEqual(0); // 1st item on the graph
    expect(result.datasets[0].data[0].x.length).toEqual(2); // two variables on x axis

    expect(result.datasets[1].data.length).toEqual(1);
    expect(result.datasets[1].data[0].duration).toEqual(4);
    expect(result.datasets[1].data[0].y).toEqual(1); // 2nd item on the graph
    expect(result.datasets[1].data[0].x.length).toEqual(2); // two variables on x axis

    expect(result.datasets[0].label).toContain("Payment: $100");
    expect(result.datasets[1].label).toContain("Payment: $50");
  });
});
