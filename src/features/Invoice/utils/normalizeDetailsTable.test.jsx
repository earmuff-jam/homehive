import { normalizeTableData } from "features/Invoice/utils/normalizeTableData";
import { describe, expect, it } from "vitest";

describe("normalizeTableData", () => {
  it("sums payments and deduplicates categories and payment methods", () => {
    const mockInvoice = [
      {
        invoiceStatus: "PAID",
        startDate: "2025-01-01",
        endDate: "2025-01-10",
        updatedOn: "2025-01-11",
        lineItems: [
          {
            payment: "100",
            category: { label: "Rent" },
            paymentMethod: "Card",
          },
          {
            payment: "50",
            category: { label: "Rent" }, // duplicate category
            paymentMethod: "Card", // duplicate method
          },
          {
            payment: "25",
            category: { label: "Utilities" },
            paymentMethod: "Cash",
          },
        ],
      },
    ];

    const result = normalizeTableData(mockInvoice);
    expect(result).toHaveLength(1);

    const normalized = result[0];
    expect(normalized.total).toBe(175);

    expect(normalized.category).toBe("Rent / Utilities");
    expect(normalized.paymentMethod).toBe("Card / Cash");

    expect(normalized.invoiceStatus).toBe("PAID");
    expect(normalized.startDate).toBe("2025-01-01");

    expect(normalized.endDate).toBe("2025-01-10");
    expect(normalized.updatedOn).toBe("2025-01-11");
  });

  it("handles empty input safely", () => {
    expect(normalizeTableData()).toEqual([]);
  });

  it("handles missing or zero payments gracefully", () => {
    const mockInvoice = [
      {
        lineItems: [
          { payment: "0", category: { label: "Rent" } },
          { payment: undefined, category: { label: "Rent" } },
        ],
      },
    ];

    const result = normalizeTableData(mockInvoice);

    expect(result[0].total).toBe(0);
    expect(result[0].category).toBe("Rent");
  });
});
