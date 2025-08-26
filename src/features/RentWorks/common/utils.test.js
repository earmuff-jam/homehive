/* eslint-disable */
import dayjs from "dayjs";

// required to mock the config
jest.mock("src/config");

const {
  isAssociatedPropertySoR,
  getCurrentMonthPaidRent,
  getRentStatus,
  isRentDue,
  getNextMonthlyDueDate,
  getOccupancyRate,
  derieveTotalRent,
  formatCurrency,
  sumCentsToDollars,
  buildPaymentLineItems,
  isFeatureEnabled,
} = require("features/RentWorks/common/utils");

const mockSampleProperty = {
  rentees: ["earmuffjam@gmail.com"],
  rent: "1000",
  additional_rent: "200",
};

const primaryTenant = {
  email: "earmuffjam@gmail.com",
  isActive: true,
  isSoR: false,
  isPrimary: true,
};

const mockEnabledFeatureFlags = new Map([
  ["analytics", true],
  ["invoicer", true],
  ["invoicerPro", true],
  ["userInformation", true],
  ["sendEmail", true],
]);

describe("utils tests", () => {
  describe("validate isAssociatedPropertySoR function returns correct boolean value.", () => {
    it("returns true when no tenants", () => {
      expect(isAssociatedPropertySoR(mockSampleProperty, [])).toBe(true);
    });

    it("returns false when tenants exist but none are SoR", () => {
      expect(isAssociatedPropertySoR(mockSampleProperty, [primaryTenant])).toBe(
        false,
      );
    });

    it("returns true when at least one active tenant is SoR", () => {
      const tenants = [{ ...primaryTenant, isSoR: true }];
      expect(isAssociatedPropertySoR(mockSampleProperty, tenants)).toBe(true);
    });
  });

  describe("validate getCurrentMonthPaidRent function returns rent for the current month.", () => {
    const currentMonth = dayjs().format("MMMM");

    it("returns undefined when input is empty", () => {
      expect(getCurrentMonthPaidRent([])).toBeUndefined();
    });

    it("returns undefined when no rents match current month", () => {
      const allRents = [
        { rentMonth: "January", status: "Paid" },
        { rentMonth: "February", status: "Paid" },
      ];
      expect(getCurrentMonthPaidRent(allRents)).toBeUndefined();
    });

    it("returns undefined when no rents are marked as paid", () => {
      const allRents = [
        { rentMonth: currentMonth, status: "Pending" },
        { rentMonth: currentMonth, status: "Unpaid" },
      ];
      expect(getCurrentMonthPaidRent(allRents)).toBeUndefined();
    });

    it("returns rent when there's one paid rent for current month", () => {
      const rent = { rentMonth: currentMonth, status: "Paid", amount: 1000 };
      const allRents = [rent];
      expect(getCurrentMonthPaidRent(allRents)).toEqual(rent);
    });

    it("returns first paid rent if multiple paid rents for current month", () => {
      const rent1 = { rentMonth: currentMonth, status: "Paid", amount: 1000 };
      const rent2 = { rentMonth: currentMonth, status: "Paid", amount: 1200 };
      const allRents = [rent1, rent2];
      expect(getCurrentMonthPaidRent(allRents)).toEqual(rent1);
    });

    it("handles status casing (e.g., 'PAID', 'paid', 'Paid')", () => {
      const rent = { rentMonth: currentMonth, status: "PAID", amount: 1000 };
      const allRents = [rent];
      expect(getCurrentMonthPaidRent(allRents)).toEqual(rent);
    });
  });

  describe("validate getRentStatus function returns correct color and label based on params.", () => {
    it("returns 'Paid' when isPaid is true", () => {
      const result = getRentStatus({ isPaid: true, isLate: true });
      expect(result).toEqual({ color: "success", label: "Paid" });
    });

    it("returns 'Paid' when isPaid is true and isLate is false", () => {
      const result = getRentStatus({ isPaid: true, isLate: false });
      expect(result).toEqual({ color: "success", label: "Paid" });
    });

    it("returns 'Overdue' when isPaid is false and isLate is true", () => {
      const result = getRentStatus({ isPaid: false, isLate: true });
      expect(result).toEqual({ color: "error", label: "Overdue" });
    });

    it("returns 'Unpaid' when both isPaid and isLate are false", () => {
      const result = getRentStatus({ isPaid: false, isLate: false });
      expect(result).toEqual({ color: "warning", label: "Unpaid" });
    });

    it("returns 'Unpaid' when isPaid and isLate are undefined", () => {
      const result = getRentStatus({});
      expect(result).toEqual({ color: "warning", label: "Unpaid" });
    });
  });

  describe("validate isRentDue function returns correct boolean value based on params.", () => {
    const fixedToday = dayjs("2025-08-03");
    const leaseStart = "07-01-2025";

    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(fixedToday.toDate());
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("returns false if today's date is before lease start", () => {
      const result = isRentDue("09-01-2025", 3, null);
      expect(result).toBe(false);
    });

    it("returns false if today is within grace period and rent is unpaid", () => {
      const earlyToday = dayjs("2025-08-02");
      jest.setSystemTime(earlyToday.toDate());

      const result = isRentDue(leaseStart, 3, null); // 3-day grace → until Aug 3
      expect(result).toBe(false);
    });

    it("returns false if rent for current month is paid", () => {
      const result = isRentDue(leaseStart, 3, {
        rentMonth: "August",
        status: "Paid",
      });
      expect(result).toBe(false);
    });

    it("handles uppercase/lowercase rent status correctly", () => {
      const result = isRentDue(leaseStart, 3, {
        rentMonth: "August",
        status: "PAID",
      });
      expect(result).toBe(false);
    });
  });

  describe("validate getNextMonthlyDueDate function returns correct due date", () => {
    const mockedToday = dayjs("2025-08-03");

    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(mockedToday.toDate());
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("returns empty string if startDate is falsy", () => {
      expect(getNextMonthlyDueDate()).toBe("");
      expect(getNextMonthlyDueDate(null)).toBe("");
    });

    it("returns this month's date if target day is today or later", () => {
      const result = getNextMonthlyDueDate("2020-08-10"); // target day = 10
      expect(result).toBe("2025-08-10"); // still August
    });

    it("returns next month's date if target day already passed this month", () => {
      const result = getNextMonthlyDueDate("2020-08-01"); // target day = 1
      expect(result).toBe("2025-09-01"); // next month
    });

    it("handles edge case when target day is today", () => {
      const result = getNextMonthlyDueDate("2020-08-03"); // same as today
      expect(result).toBe("2025-08-03");
    });
  });

  describe("validate getOccupancyRate function returns the correct occupancy rate", () => {
    const mockSampleProperty = { units: 4 };

    describe("when isAnyTenantSoR is true", () => {
      it("returns correct rate when some units are occupied", () => {
        const tenants = [{}, {}, {}]; // 3 of 4 occupied
        const result = getOccupancyRate(mockSampleProperty, tenants, true);
        expect(result).toBe(75); // (3 / 4) * 100 = 75
      });

      it("returns 100 when all units are occupied", () => {
        const tenants = [{}, {}, {}, {}];
        const result = getOccupancyRate(mockSampleProperty, tenants, true);
        expect(result).toBe(100);
      });

      it("returns 0 if totalUnits is 0", () => {
        const tenants = [{}, {}];
        const result = getOccupancyRate({ units: 0 }, tenants, true);
        expect(result).toBe(0);
      });

      it("returns 0 if totalUnits is missing or invalid", () => {
        const tenants = [{}];
        expect(getOccupancyRate({}, tenants, true)).toBe(0);
        expect(getOccupancyRate({ units: null }, tenants, true)).toBe(0);
      });
    });

    describe("when isAnyTenantSoR is false", () => {
      it("returns 100 if there are any tenants", () => {
        const tenants = [{}];
        const result = getOccupancyRate(mockSampleProperty, tenants, false);
        expect(result).toBe(100);
      });

      it("returns 0 if there are no tenants", () => {
        const result = getOccupancyRate(mockSampleProperty, [], false);
        expect(result).toBe(0);
      });

      it("returns 0 if tenants is undefined", () => {
        const result = getOccupancyRate(mockSampleProperty, undefined, false);
        expect(result).toBe(0);
      });
    });
  });

  describe(" validate derieveTotalRent function returns correct values based on the params.", () => {
    describe("when isAnyTenantSoR is true", () => {
      it("sums each tenant's rent + additional_rent", () => {
        const tenants = [{ rent: "800" }, { rent: "900" }];
        // (800 + 200) + (900 + 200) = 2100
        const result = derieveTotalRent(mockSampleProperty, tenants, true);
        expect(result).toBe(2100);
      });

      it("defaults tenant rent to 0 if missing", () => {
        const tenants = [{}, { rent: "1000" }];
        // (0 + 200) + (1000 + 200) = 1400
        const result = derieveTotalRent(mockSampleProperty, tenants, true);
        expect(result).toBe(1400);
      });

      // TODO : need to fix calculation of rent for tenants with SoR status.
      // it("treats additional_rent as 0 if undefined", () => {
      //   const property = { rent: "1000" };
      //   const tenants = [{ daily_fee: "15" }, { initial_late_fee: "75" }];
      //   const result = derieveTotalRent(property, tenants, true);
      //   // (800 + 0) + (700 + 0) = 1500
      //   expect(result).toBe(1500);
      // });

      it("returns 0 if no tenants", () => {
        const result = derieveTotalRent(mockSampleProperty, [], true);
        expect(result).toBe(0);
      });
    });

    describe("when isAnyTenantSoR is false", () => {
      it("returns property rent + additional_rent", () => {
        const result = derieveTotalRent(mockSampleProperty, [], false);
        expect(result).toBe(1200); // 1000 + 200
      });

      it("returns only rent if additional_rent is missing", () => {
        const mockSamplePropertyOne = { rent: "800" };
        const result = derieveTotalRent(mockSamplePropertyOne, [], false);
        expect(result).toBe(800);
      });

      it("returns 0 if both rent and additional_rent are missing", () => {
        const result = derieveTotalRent({}, [], false);
        expect(result).toBe(0);
      });
    });
  });

  describe("validate formatCurrency function to return correct value based on the params.", () => {
    it("formats whole numbers correctly", () => {
      expect(formatCurrency(100)).toBe("100.00");
      expect(formatCurrency(0)).toBe("0.00");
    });

    it("formats numbers with decimals correctly", () => {
      expect(formatCurrency(123.4)).toBe("123.40");
      expect(formatCurrency(56.789)).toBe("56.79"); // rounds up
    });

    it("formats negative numbers correctly", () => {
      expect(formatCurrency(-45.6)).toBe("-45.60");
    });

    it("defaults to 0.00 if no argument provided", () => {
      expect(formatCurrency()).toBe("0.00");
    });

    it("throws error if input is not a number", () => {
      expect(() => formatCurrency("abc")).toThrow();
      expect(() => formatCurrency(null)).toThrow();
      expect(() => formatCurrency(undefined)).not.toThrow();
    });
  });

  describe("validate sumCentsToDollars function to return correct value based on the params.", () => {
    it("sums whole numbers in cents correctly", () => {
      expect(sumCentsToDollars("100", "200", "300")).toBe(6); // 600 cents = 6 dollars
      expect(sumCentsToDollars("0", "0", "0")).toBe(0);
    });

    it("handles single values correctly", () => {
      expect(sumCentsToDollars("150")).toBe(1.5);
      expect(sumCentsToDollars("99")).toBe(0.99);
    });

    it("handles decimals and mixed inputs", () => {
      expect(sumCentsToDollars("123", "456.7")).toBeCloseTo(
        5.796999999999999,
        5,
      );
    });

    it("handles negative values correctly", () => {
      expect(sumCentsToDollars("-100", "200")).toBe(1);
      expect(sumCentsToDollars("-50", "-50")).toBe(-1);
    });

    it("returns 0 if no arguments provided", () => {
      expect(sumCentsToDollars()).toBe(0);
    });

    it("ignores non-numeric values", () => {
      expect(sumCentsToDollars("100", "abc", null, undefined)).toBe(1);
    });
  });

  describe("validate buildPaymentLineItems function to return correct line items.", () => {
    it("returns correct line items with valid property and tenant values", () => {
      const property = { rent: "120000", additional_rent: "5000" };
      const tenant = { initialLateFee: "2500", dailyLateFee: "100" };

      const result = buildPaymentLineItems(property, tenant);

      expect(result).toEqual([
        { name: { label: "Rent Amount", value: 120000 } },
        { name: { label: "Additional Charges", value: 5000 } },
        { name: { label: "Initial Late fee", value: 2500 } },
        { name: { label: "Daily Late fee", value: 100 } },
      ]);
    });

    it("returns 0 for missing property or tenant values", () => {
      const result = buildPaymentLineItems({}, {});

      expect(result).toEqual([
        { name: { label: "Rent Amount", value: 0 } },
        { name: { label: "Additional Charges", value: 0 } },
        { name: { label: "Initial Late fee", value: 0 } },
        { name: { label: "Daily Late fee", value: 0 } },
      ]);
    });

    it("handles undefined inputs gracefully", () => {
      const result = buildPaymentLineItems();

      expect(result).toEqual([
        { name: { label: "Rent Amount", value: 0 } },
        { name: { label: "Additional Charges", value: 0 } },
        { name: { label: "Initial Late fee", value: 0 } },
        { name: { label: "Daily Late fee", value: 0 } },
      ]);
    });

    it("converts string values to numbers correctly", () => {
      const property = { rent: "2000", additional_rent: "300" };
      const tenant = { initialLateFee: "50", dailyLateFee: "10" };

      const result = buildPaymentLineItems(property, tenant);

      expect(result).toEqual([
        { name: { label: "Rent Amount", value: 2000 } },
        { name: { label: "Additional Charges", value: 300 } },
        { name: { label: "Initial Late fee", value: 50 } },
        { name: { label: "Daily Late fee", value: 10 } },
      ]);
    });

    it("returns 0 for non-numeric values", () => {
      const property = { rent: "abc", additional_rent: null };
      const tenant = { initialLateFee: undefined, dailyLateFee: "xyz" };

      const result = buildPaymentLineItems(property, tenant);

      expect(result).toEqual([
        { name: { label: "Rent Amount", value: 0 } },
        { name: { label: "Additional Charges", value: 0 } },
        { name: { label: "Initial Late fee", value: 0 } },
        { name: { label: "Daily Late fee", value: 0 } },
      ]);
    });
  });

  describe("validate isFeatureEnabled function to return correct boolean values", () => {
    it("returns true for features that are enabled", () => {
      expect(isFeatureEnabled(mockEnabledFeatureFlags, "analytics")).toBe(true);
      expect(isFeatureEnabled(mockEnabledFeatureFlags, "invoicer")).toBe(true);
      expect(isFeatureEnabled(mockEnabledFeatureFlags, "sendEmail")).toBe(true);
    });

    it("returns false for features that are not in the map", () => {
      expect(
        isFeatureEnabled(mockEnabledFeatureFlags, "nonExistingFeature"),
      ).toBe(false);
    });

    it("returns false for features that are explicitly disabled", () => {
      const flags = new Map(mockEnabledFeatureFlags);
      flags.set("analytics", false);

      expect(isFeatureEnabled(flags, "analytics")).toBe(false);
    });

    it("handles empty feature flags map gracefully", () => {
      const emptyFlags = new Map();
      expect(isFeatureEnabled(emptyFlags, "analytics")).toBe(false);
    });

    it("handles undefined or null inputs gracefully", () => {
      expect(isFeatureEnabled(undefined, "analytics")).toBe(false);
      expect(isFeatureEnabled(null, "invoicer")).toBe(false);
    });
  });
});
