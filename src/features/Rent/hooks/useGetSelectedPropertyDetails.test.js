import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";
import { ManualRentStatusEnumValue } from "features/Rent/utils";

describe("useGetSelectedPropertyDetailsHook tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("for non SoR properties", () => {
    const mockProperty = {
      id: 1,
      title: "Test Property",
      rent: 2000,
      additionalRent: 500,
    };

    const mockPrimaryTenant = {
      id: 1,
      startDate: "2026-01-01",
      firstName: "john",
      lastName: "doe",
      isPrimary: true,
      isSoR: false,
    };

    const mockSecondaryTenant = {
      id: 1,
      startDate: "2026-02-01",
      firstName: "Jane",
      lastName: "Smith",
      isPrimary: true,
      isSoR: false,
    };

    const mockCurrentMonthRent = {
      rentMonth: "April",
      status: ManualRentStatusEnumValue,
    };

    it("should return correct values when current month is paid", () => {
      const result = useSelectedPropertyDetails(
        mockProperty,
        [mockPrimaryTenant, mockSecondaryTenant],
        mockCurrentMonthRent,
      );

      expect(result.totalRent).toBe(2500);
      expect(result.nextPaymentDueDate).toBe("May 01");
      expect(result.isSelectedPropertySoR).toBe(false); // default SoR is false
    });

    it("should return correct values when no rental payment data is detected", () => {
      const result = useSelectedPropertyDetails(
        mockProperty,
        [mockPrimaryTenant, mockSecondaryTenant],
        null,
      );

      expect(result.totalRent).toBe(2500);
      expect(result.nextPaymentDueDate).toBe("May 01");
      expect(result.isSelectedPropertySoR).toBe(false); // default SoR is false
    });
  });

  describe("for unpaid rental payments", () => {
    const mockProperty = {
      id: 1,
      title: "Test Property",
      rent: 2000,
      additionalRent: 500,
    };

    const mockPrimaryTenant = {
      id: 1,
      startDate: "2026-01-01",
      firstName: "john",
      lastName: "doe",
      isPrimary: true,
      isSoR: false,
    };

    const mockSecondaryTenant = {
      id: 1,
      startDate: "2026-02-01",
      firstName: "Jane",
      lastName: "Smith",
      isPrimary: true,
      isSoR: false,
    };

    const mockPreviousMonthRent = {
      rentMonth: "March",
      status: ManualRentStatusEnumValue,
    };

    it("should return correct values when rental payment intent is not complete", () => {
      const result = useSelectedPropertyDetails(
        mockProperty,
        [mockPrimaryTenant, mockSecondaryTenant],
        mockPreviousMonthRent,
      );

      expect(result.totalRent).toBe(2500);
      expect(result.nextPaymentDueDate).toBe("Apr 01"); // next month after last payment was made
      expect(result.isSelectedPropertySoR).toBe(false); // default SoR is false
    });
  });

  describe("for missing properties or tenants not provisioned yet", () => {
    const mockProperty = {
      id: 1,
      title: "Test Property",
    };

    const mockPrimaryTenant = {
      id: 1,
      startDate: "2026-05-01",
      firstName: "john",
      lastName: "doe",
      isPrimary: true,
      isSoR: false,
    };

    const mockPreviousMonthRent = {
      rentMonth: "March",
      status: ManualRentStatusEnumValue,
    };

    it("should return correct values when rental payment intent is not complete", () => {
      const result = useSelectedPropertyDetails(
        mockProperty,
        [mockPrimaryTenant],
        mockPreviousMonthRent,
      );

      expect(result.totalRent).toBe(0);
      expect(result.nextPaymentDueDate).toBe("May 01"); // day of provision
      expect(result.isSelectedPropertySoR).toBe(false); // default SoR is false
    });
  });
});
