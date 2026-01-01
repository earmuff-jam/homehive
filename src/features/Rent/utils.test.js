const dayjs = require("dayjs");
const { stripHTMLForEmailMessages, isValid, updateDateTime, formatCurrency, sumCentsToDollars, derieveTotalRent, getOccupancyRate, getNextMonthlyDueDate, isRentDue, getRentStatus, getRentDetails, isAssociatedPropertySoR, buildPaymentLineItems, isFeatureEnabled } = require("features/Rent/utils");

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

  describe("test isValid (email validator) function", () => {
    it("returns false for empty email", () => {
      expect(isValid("")).toBe(false);
      expect(isValid("   ")).toBe(false);
    });

    it("returns false for invalid email format", () => {
      expect(isValid("test")).toBe(false);
      expect(isValid("test@")).toBe(false);
      expect(isValid("test@test")).toBe(false);
      expect(isValid("test@test.")).toBe(false);
    });

    it("returns false when email exceeds 150 characters", () => {
      const longEmail = "a".repeat(145) + "@test.com"; // >150 chars total

      expect(isValid(longEmail)).toBe(false);
    });

    it("returns true for a valid email", () => {
      expect(isValid("test@example.com")).toBe(true);
      expect(isValid("john.doe-1@sub.domain.co")).toBe(true);
    });

    it("does not trim whitespace before validation", () => {
      expect(isValid("  test@example.com  ")).toBe(false);
    });
  });

  describe("test updateDateTime function", () => {
    it("returns next monthly ISO date", () => {
      const start = dayjs().subtract(2, "month");

      const result = updateDateTime(start);

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

  describe("test derieveTotalRent function", () => {
    it("returns total rent for non-SoR property", () => {
      const property = { rent: 1000, additional_rent: 100 };

      expect(derieveTotalRent(property, [], false)).toBe(1100);
    });

    it("calculates per-tenant rent for SoR", () => {
      const property = { additional_rent: 50 };
      const tenants = [{ rent: 500 }, { rent: 600 }];

      expect(derieveTotalRent(property, tenants, true)).toBe(1200);
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

  describe("test getRentDetails function", () => {
    it("returns paid rent for current month", () => {
      const month = dayjs().format("MMMM");

      const data = [
        { rentMonth: month, status: "paid" },
        { rentMonth: "January", status: "unpaid" },
      ];

      expect(getRentDetails(data)).toEqual(data[0]);
    });
  });

  describe("test isAssociatedPropertySoR function", () => {
    it("returns true if active SoR tenant exists", () => {
      const property = { rentees: [{}] };
      const tenants = [{ isActive: true, isSoR: true }];

      expect(isAssociatedPropertySoR(property, tenants)).toBe(true);
    });
  });

  describe("test buildPaymentLineItems function", () => {
    it("builds payment line items", () => {
      const property = { rent: 1000, additional_rent: 100 };
      const tenant = { initialLateFee: 25, dailyLateFee: 5 };

      const result = buildPaymentLineItems(property, tenant);

      expect(result).toHaveLength(4);
      expect(result[0].name.label).toBe("Rent Amount");
    });
  });

  describe("test isFeatureEnabled function", () => {
    it("returns true when feature is enabled", () => {
      expect(isFeatureEnabled("analytics")).toBe(true);
      expect(isFeatureEnabled("invoicer")).toBe(true);
      expect(isFeatureEnabled("invoicerPro")).toBe(false);
      expect(isFeatureEnabled("userInformation")).toBe(true);
      expect(isFeatureEnabled("sendEmail")).toBe(true);
    });

    it("returns false when feature is missing", () => {
      expect(isFeatureEnabled("missing")).toBe(false);
    });
  });
});
