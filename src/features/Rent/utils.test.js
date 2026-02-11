const dayjs = require("dayjs");
const {
  stripHTMLForEmailMessages,
  formatCurrency,
  getOccupancyRate,
  isAssociatedPropertySoR,
  buildPaymentLineItems,
  isFeatureEnabled,
  getColorAndLabelForCurrentMonth,
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

  describe("test formatCurrency function", () => {
    it("formats number to 2 decimals", () => {
      expect(formatCurrency(10)).toBe("10.00");
      expect(formatCurrency(10.5)).toBe("10.50");
    });

    it("defaults to 0.00", () => {
      expect(formatCurrency()).toBe("0.00");
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

  describe("test isAssociatedPropertySoR function", () => {
    it("returns true if active SoR tenant exists", () => {
      const property = { rentees: [{}] };
      const tenants = [{ isActive: true, isSoR: true }];

      expect(isAssociatedPropertySoR(property, tenants)).toBe(true);
    });
  });

  describe("test buildPaymentLineItems function", () => {
    it("builds payment line items", () => {
      const property = { rent: 1000, additionalRent: 100 };
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

  describe("test getColorAndLabelForCurrentMonth function", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe("when rent is paid", () => {
      it("returns success regardless of grace period or start date", () => {
        jest.setSystemTime(new Date("2026-03-15"));

        const result = getColorAndLabelForCurrentMonth(
          "2026-01-01",
          { status: "paid" },
          3,
        );

        expect(result.color).toBe("success");
        expect(result.label).toBe("Paid");
      });

      it("is case insensitive", () => {
        jest.setSystemTime(new Date("2026-03-15"));

        const result = getColorAndLabelForCurrentMonth(
          "2026-01-01",
          { status: "PAID" },
          3,
        );

        expect(result.color).toBe("success");
        expect(result.label).toBe("Paid");
      });
    });

    describe("when rent is unpaid", () => {
      it("returns 'Past due' if after grace period", () => {
        // March 10th, grace = 3 → grace ends March 4
        jest.setSystemTime(new Date("2026-03-10"));

        const result = getColorAndLabelForCurrentMonth(
          "2026-01-01",
          { status: "unpaid" },
          3,
        );

        expect(result.color).toBe("error");
        expect(result.label).toBe("Past due");
      });

      it("returns 'Grace Period' if within grace period", () => {
        // March 2nd, grace = 5 → still within
        jest.setSystemTime(new Date("2026-03-02"));

        const result = getColorAndLabelForCurrentMonth(
          "2026-01-01",
          { status: "unpaid" },
          5,
        );

        expect(result.color).toBe("secondary");
        expect(result.label).toBe("Grace Period");
      });

      it("boundary: exactly on grace day is NOT past due", () => {
        // grace = 3 → boundary March 4
        jest.setSystemTime(new Date("2026-03-04"));

        const result = getColorAndLabelForCurrentMonth(
          "2026-01-01",
          { status: "unpaid" },
          3,
        );

        expect(result.color).toBe("secondary");
        expect(result.label).toBe("Grace Period");
      });
    });

    describe("first month renting logic safety", () => {
      it("does not break when startDate is current month", () => {
        jest.setSystemTime(new Date("2026-03-02"));

        const result = getColorAndLabelForCurrentMonth(
          "2026-03-01",
          { status: "unpaid" },
          3,
        );

        expect(["secondary", "error", "success"]).toContain(result.color);
        expect(typeof result.label).toBe("string");
      });
    });

    describe("default grace period", () => {
      it("uses default grace period of 3 days when not provided", () => {
        jest.setSystemTime(new Date("2026-03-10"));

        const result = getColorAndLabelForCurrentMonth("2026-01-01", {
          status: "unpaid",
        });

        expect(result.color).toBe("error");
        expect(result.label).toBe("Past due");
      });
    });
  });
});
