import {
  normalizeDetailsTableData,
  normalizeInvoiceItemTypeChartDataset,
  normalizeInvoiceTimelineChartDataset,
  normalizeInvoiceTrendsChartsDataset,
} from "./utils";

describe("Invoice normalization utilities", () => {
  describe("normalizeDetailsTableData", () => {
    it("sums payments and deduplicates categories and payment methods", () => {
      const mockInvoice = [
        {
          invoiceStatus: "PAID",
          startDate: "2025-01-01",
          endDate: "2025-01-10",
          updatedOn: "2025-01-11",
          lineItems: [
            {
              payment: 100,
              category: { label: "Rent" },
              paymentMethod: "Card",
            },
            {
              payment: 50,
              category: { label: "Rent" }, // duplicate category
              paymentMethod: "Card", // duplicate method
            },
            {
              payment: 25,
              category: { label: "Utilities" },
              paymentMethod: "Cash",
            },
          ],
        },
      ];

      const result = normalizeDetailsTableData(mockInvoice);

      expect(result).toHaveLength(1);

      const normalized = result[0];

      // ✅ total sum
      expect(normalized.total).toBe(175);

      // ✅ deduplicated + joined values
      expect(normalized.category).toBe("Rent / Utilities");
      expect(normalized.paymentMethod).toBe("Card / Cash");

      // ✅ passthrough fields
      expect(normalized.invoiceStatus).toBe("PAID");
      expect(normalized.startDate).toBe("2025-01-01");
      expect(normalized.endDate).toBe("2025-01-10");
      expect(normalized.updatedOn).toBe("2025-01-11");
    });

    it("handles missing or zero payments gracefully", () => {
      const mockInvoice = [
        {
          lineItems: [
            { payment: 0, category: { label: "Rent" } },
            { payment: undefined, category: { label: "Rent" } },
          ],
        },
      ];

      const result = normalizeDetailsTableData(mockInvoice);

      expect(result[0].total).toBe(0);
      expect(result[0].category).toBe("Rent");
    });
  });

  describe("normalizeInvoiceItemTypeChartDataset", () => {
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

      const result = normalizeInvoiceItemTypeChartDataset(input);

      expect(result.labels).toEqual(["Rent", "Utilities"]);
      expect(result.datasets[0].data).toEqual([2, 1]);
    });

    it("handles missing categories", () => {
      const input = [{ lineItems: [{}] }];

      const result = normalizeInvoiceItemTypeChartDataset(input);

      expect(result.labels).toEqual(["Unknown Item"]);
      expect(result.datasets[0].data).toEqual([1]);
    });
  });

  describe("normalizeInvoiceTrendsChartsDataset", () => {
    it("builds collected and tax datasets per month", () => {
      const input = [
        {
          startDate: "2025-01-01",
          taxRate: 10,
          lineItems: [{ payment: 100 }],
        },
        {
          startDate: "2025-01-15",
          taxRate: 10,
          lineItems: [{ payment: 50 }],
        },
      ];

      const result = normalizeInvoiceTrendsChartsDataset(input, "bar");

      expect(result[0].labels).toEqual(["January"]);
      expect(result[0].datasets[0].data).toEqual([150]); // collected
      expect(result[0].datasets[1].data).toEqual([15]); // tax
    });

    it("returns empty datasets when input is empty", () => {
      const result = normalizeInvoiceTrendsChartsDataset([]);

      expect(result[0].labels).toEqual([]);
      expect(result[0].datasets[0].data).toEqual([]);
      expect(result[0].datasets[1].data).toEqual([]);
    });
  });

  describe("normalizeInvoiceTimelineChartDataset", () => {
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

      const result = normalizeInvoiceTimelineChartDataset(input);

      expect(result.labels).toEqual(["January", "February"]);
      expect(result.datasets).toHaveLength(2);

      expect(result.datasets[0].data).toEqual([9, null]);
      expect(result.datasets[1].data).toEqual([null, 4]);

      expect(result.datasets[0].label).toContain("Payment: $100");
      expect(result.datasets[1].label).toContain("Payment: $50");
    });
  });
});
