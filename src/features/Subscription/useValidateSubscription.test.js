import dayjs from "dayjs";

// adjust import
import { useValidateSubscription } from "./useValidateSubscription";
import { Role } from "features/Auth/AuthHelper";
import { StripePaymentStatusCompleted } from "features/Subscription/constants";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useValidateSubscription", () => {
  const subscription = {
    id: "test_user_id",
    stripeEventType: "test.stripe_event_type",
    subscriptionStatus: StripePaymentStatusCompleted,
    stripeSubscriptionId: "test_subscription_identifier",
    stripeInvoiceId: "test_stripe_invoice_identifier",
    updatedOn: "2019-03-13T03:13:57.882Z",
    subscriptionProductName: "subscription_product_name_identifier",
    subscriptionAmount: 200,
    stripeCustomerEmail: "customer_email@outlook.com",
    createdOn: "2026-06-13T02:12:20.318Z",
    stripeCustomerId: "test_user_id",
    isFirstSubscriptionForCustomer: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-04T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for non-owner users", () => {
    expect(useValidateSubscription(subscription, "Tenant", "2026-08-01")).toBe(
      true,
    );
  });

  it("returns false when owner has no subscription", () => {
    expect(useValidateSubscription({}, Role.Owner, "2026-08-01")).toBe(false);
  });

  it("returns true when owner has a valid paid subscription", () => {
    expect(
      useValidateSubscription(subscription, Role.Owner, "2026-06-01"),
    ).toBe(true);
  });

  it("returns false when subscription status is missing", () => {
    const invalid = {
      ...subscription,
      subscriptionStatus: null,
    };

    expect(useValidateSubscription(invalid, Role.Owner, "2026-06-01")).toBe(
      false,
    );
  });

  it("returns false when stripe subscription id is missing", () => {
    const invalid = {
      ...subscription,
      stripeSubscriptionId: "",
    };

    expect(useValidateSubscription(invalid, Role.Owner, "2026-06-01")).toBe(
      false,
    );
  });

  it("returns true when owner is within the 7-day trial", () => {
    const trial = {
      ...subscription,
      isFirstSubscriptionForCustomer: true,
      subscriptionStatus: null,
      stripeSubscriptionId: "",
    };

    expect(
      useValidateSubscription(
        trial,
        Role.Owner,
        dayjs().subtract(3, "day").toISOString(),
      ),
    ).toBe(true);
  });

  it("returns false when the trial has expired and subscription is invalid", () => {
    const expiredTrial = {
      ...subscription,
      isFirstSubscriptionForCustomer: true,
      subscriptionStatus: null,
      stripeSubscriptionId: "",
    };

    expect(
      useValidateSubscription(
        expiredTrial,
        Role.Owner,
        dayjs().subtract(8, "day").toISOString(),
      ),
    ).toBe(false);
  });

  it("returns false when subscription status is not paid", () => {
    const unpaid = {
      ...subscription,
      subscriptionStatus: "past_due",
    };

    expect(useValidateSubscription(unpaid, Role.Owner, "2026-06-01")).toBe(
      false,
    );
  });
});
