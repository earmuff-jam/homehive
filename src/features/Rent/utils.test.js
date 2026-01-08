const dayjs = require("dayjs");
const {
  stripHTMLForEmailMessages,
  isValid,
  displayNextPaymentDueDate,
  formatCurrency,
  sumCentsToDollars,
  derieveTotalRent,
  getOccupancyRate,
  getNextMonthlyDueDate,
  isRentDue,
  getRentStatus,
  getRentDetails,
  isAssociatedPropertySoR,
  buildPaymentLineItems,
  isFeatureEnabled,
} = require("features/Rent/utils");

describe("Test utility functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("test stripHTMLForEmailMessages function", () => {
    it("removes HTML tags and returns plain text", () => {
      const html = "<p>Hello <strong>World</strong></p>";

      const result = stripHTMLForEmailMessages(html);

      expect(result).toBe("Hello World");
    });

    it("handles nested HTML elements", () => {
      const html = "<div><span>Line 1</span><br /><span>Line 2</span></div>";

      const result = stripHTMLForEmailMessages(html);

      expect(result).toBe("Line 1Line 2");
    });

    it("returns empty string for empty input", () => {
      const result = stripHTMLForEmailMessages("");

      expect(result).toBe("");
    });
  });

  describe("test displayNextPaymentDueDate function", () => {
    it("returns next monthly ISO date", () => {
      const start = dayjs().subtract(2, "month");

      const result = displayNextPaymentDueDate(start);

      expect(dayjs(result).isValid()).toBe(true);
    });
  });

  describe("test formatCurrency function", () => {
    it("formats number to 2 decimals", () => {
      expect(formatCurrency(10)).toBe("10.00");
      expect(formatCurrency(10.5)).toBe("10.50");
    });

    it("defaults to 0.00", () => {
      expect(formatCurrency()).toBe("0.00");
    });
  });

  describe("test sumCentsToDollars function", () => {
    it("converts cents to dollars and sums", () => {
      expect(sumCentsToDollars("100", "250")).toBe(3.5);
    });

    it("ignores invalid values", () => {
      expect(sumCentsToDollars("100", "abc")).toBe(1);
    });
  });

  describe("test getOccupancyRate function", () => {
    it("calculates occupancy for SoR", () => {
      const property = { units: 4 };
      const tenants = [{}, {}];

      expect(getOccupancyRate(property, tenants, true)).toBe(50);
    });

    it("returns 100% for non-SoR with tenants", () => {
      expect(getOccupancyRate({}, [{}], false)).toBe(100);
    });
  });

  describe("test getNextMonthlyDueDate function", () => {
    it("returns YYYY-MM-DD string", () => {
      const start = dayjs().subtract(1, "month").format("YYYY-MM-DD");

      const result = getNextMonthlyDueDate(start);

      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it("returns empty string if no startDate", () => {
      expect(getNextMonthlyDueDate()).toBe("");
    });
  });

  describe("test isRentDue function", () => {
    it("returns false before lease start", () => {
      const future = dayjs().add(1, "month").format("MM-DD-YYYY");

      expect(isRentDue(future)).toBe(false);
    });
  });

  describe("test getRentStatus function", () => {
    it("returns paid status", () => {
      expect(getRentStatus({ isPaid: true })).toEqual({
        color: "success",
        label: "Paid",
      });
    });

    it("returns overdue status", () => {
      expect(getRentStatus({ isLate: true })).toEqual({
        color: "error",
        label: "Overdue",
      });
    });
  });

  describe("test isAssociatedPropertySoR function", () => {
    it("returns true if active SoR tenant exists", () => {
      const property = { rentees: [{}] };
      const tenants = [{ isActive: true, isSoR: true }];

      expect(isAssociatedPropertySoR(property, tenants)).toBe(true);
    });
  });
});
