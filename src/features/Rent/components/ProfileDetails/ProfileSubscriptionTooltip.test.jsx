import React from "react";

import { ProfileSubscriptionTooltip } from "./ProfileSubscriptionTooltip";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { StripePaymentStatusCompleted } from "features/Subscription/constants";
import { describe, expect, it, vi } from "vitest";

vi.mock("dayjs", () => ({
  __esModule: true,
  default: () => ({
    format: () => "01-01-2026",
  }),
}));

vi.mock("@mui/icons-material", () => ({
  __esModule: true,
  Payment: (props) => <div data-testid="payment-icon" {...props} />,
  DateRangeRounded: (props) => <div data-testid="date-icon" {...props} />,
}));

vi.mock("features/Subscription/SubscriptionGuard", () => ({
  __esModule: true,
  StripePaymentStatusCompleted: StripePaymentStatusCompleted,
}));

describe("ProfileSubscriptionTooltip", () => {
  it("shows loading skeleton", () => {
    const { container } = render(
      <ProfileSubscriptionTooltip data={null} isLoading={true} />,
    );

    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("renders completed subscription details", () => {
    render(
      <ProfileSubscriptionTooltip
        isLoading={false}
        data={{
          subscriptionStatus: StripePaymentStatusCompleted,
          updatedOn: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText(/Subscription details/i)).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid On:/i)).toBeInTheDocument();
  });

  it("renders fallback warning icon when not completed", () => {
    render(
      <ProfileSubscriptionTooltip
        isLoading={false}
        data={{
          subscriptionStatus: "pending",
          updatedOn: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByTestId("payment-icon")).toBeInTheDocument();
  });
});
