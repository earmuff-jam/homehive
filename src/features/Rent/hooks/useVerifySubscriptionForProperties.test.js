import dayjs from "dayjs";

import { Role } from "features/Auth/AuthHelper";
import {
  PROFESSIONAL_PLAN_PRODUCT_NAME,
  STARTER_PLAN_PRODUCT_NAME,
} from "features/Rent/constants";
import { useVerifySubscriptionForProperties } from "features/Rent/hooks/useVerifySubscriptionForProperties";

const mockUser = {
  id: 1,
  email: "testUser@gmail.com",
};

const mockUserData = {
  firstName: "John",
  lastName: "Smith",
  createdOn: "2026-04-25T02:12:20.318Z",
};

const mockLatestSubscription = {
  id: "stripeCustomerIdTest",
  subscriptionProductName: "Monthly Professional Plan",
  subscriptionStatus: "paid",
  stripeSubscriptionId: "sub_1Thh3WHDqURY09L2D3C3RVGy",
  createdOn: "2026-04-17T02:12:20.318Z",
  stripeCustomerEmail: "testUser@gmail.com",
  stripeCustomerId: "stripeCustomerIdTest",
  stripeInvoiceId: "in_1Thh3UHDqURY09L2AFv2QzXf",
  updatedOn: "2026-04-17T02:12:37.013Z",
  stripeEventType: "checkout.session.async_payment_succeeded",
  subscriptionAmount: 5,
  isFirstSubscriptionForCustomer: false,
};

const mockSubscriptionOptions = [
  {
    productId: 1,
    productName: PROFESSIONAL_PLAN_PRODUCT_NAME,
    description:
      "Best for growing portfolios with up to 10 properties. Billed Monthly",
    priceId: "testPriceIdForMonthlyProfessionalPlan",
    amount: 500,
    currency: "usd",
    interval: "month",
  },
  {
    productId: 2,
    productName: STARTER_PLAN_PRODUCT_NAME,
    description:
      "Perfect for small landlords managing up to 2 properties. Billed monthly.",
    priceId: "testPriceIdForMonthlyStarterPlan",
    amount: 200,
    currency: "usd",
    interval: "month",
  },
];

describe("for useVerifySubscriptionForProperties tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("for general users", () => {
    it("should not be able to add property", () => {
      // general users do not have correct perms
      const mockGeneralUser = { ...mockUser, role: Role.User };
      const result = useVerifySubscriptionForProperties(
        mockGeneralUser,
        mockUserData?.createdOn,
        mockLatestSubscription,
        mockSubscriptionOptions,
      );

      expect(result.displayAlert).toBe(false);
      expect(result.canAddProperty).toBe(false); // general users
    });
  });

  describe("for tenants", () => {
    it("should not be able to add property", () => {
      const mockTenantUser = { ...mockUser, role: Role.Tenant };

      const result = useVerifySubscriptionForProperties(
        mockTenantUser,
        mockUserData?.createdOn,
        mockLatestSubscription,
        mockSubscriptionOptions,
      );

      expect(result.displayAlert).toBe(false);
      expect(result.canAddProperty).toBe(false);
    });
  });

  describe("for admins", () => {
    it("should be able to add property for professional plan", () => {
      const mockAdminUser = { ...mockUser, role: Role.Admin };
      const result = useVerifySubscriptionForProperties(
        mockAdminUser,
        mockUserData?.createdOn,
        mockLatestSubscription,
        mockSubscriptionOptions,
      );
      expect(result.displayAlert).toBe(false);
      expect(result.canAddProperty).toBe(true);
    });

    it("should be able to add property for any plan despite limit for admins", () => {
      const mockAdminUser = { ...mockUser, role: Role.Admin };
      const mockUpdatedLatestSubscription = {
        ...mockLatestSubscription,
        subscriptionProductName: STARTER_PLAN_PRODUCT_NAME,
      };

      // switched plan to starter to validate admin role
      const result = useVerifySubscriptionForProperties(
        mockAdminUser,
        mockUserData?.createdOn,
        mockUpdatedLatestSubscription,
        mockSubscriptionOptions,
      );
      expect(result.displayAlert).toBe(false);
      expect(result.canAddProperty).toBe(true);
    });
  });

  describe("for property owners", () => {
    it("should be able to add property for professional plan", () => {
      const mockPropertyOwnerUser = { ...mockUser, role: Role.Owner };
      const result = useVerifySubscriptionForProperties(
        mockPropertyOwnerUser,
        mockUserData?.createdOn,
        mockLatestSubscription,
        mockSubscriptionOptions,
      );
      expect(result.displayAlert).toBe(false);
      expect(result.canAddProperty).toBe(true);
    });
    it("should not be able to add property for starter plan", () => {
      const mockPropertyOwnerUser = { ...mockUser, role: Role.Owner };
      const mockUpdatedLatestSubscription = {
        ...mockLatestSubscription,
        subscriptionProductName: STARTER_PLAN_PRODUCT_NAME,
      };
      const result = useVerifySubscriptionForProperties(
        mockPropertyOwnerUser,
        mockUserData?.createdOn,
        mockUpdatedLatestSubscription,
        mockSubscriptionOptions,
        2,
      );
      expect(result.displayAlert).toBe(false);
      expect(result.canAddProperty).toBe(false);
    });
    it("should be able to display alert for new property owners", () => {
      const mockPropertyOwnerUser = { ...mockUser, role: Role.Owner };
      const mockUpdatedLatestSubscription = {
        ...mockLatestSubscription,
        subscriptionProductName: STARTER_PLAN_PRODUCT_NAME,
        isFirstSubscriptionForCustomer: true,
      };
      const result = useVerifySubscriptionForProperties(
        mockPropertyOwnerUser,
        mockUserData?.createdOn,
        mockUpdatedLatestSubscription,
        mockSubscriptionOptions,
        0,
      );
      expect(result.displayAlert).toBe(true);
      expect(result.canAddProperty).toBe(true);
    });
  });
});
