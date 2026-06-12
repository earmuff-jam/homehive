import React from "react";

import { ProfileSubscriptionTooltip } from "./ProfileSubscriptionTooltip";
import { render, screen } from "@testing-library/react";

jest.mock("dayjs", () => () => ({
  format: () => "01-01-2026",
}));

jest.mock("@mui/icons-material", () => ({
  Payment: (props) => <div data-testid="payment-icon" {...props} />,
  DateRangeRounded: (props) => <div data-testid="date-icon" {...props} />,
}));

jest.mock("features/Subscription/SubscriptionGuard", () => ({
  StripePaymentStatusCompleted: "completed",
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
          subscriptionStatus: "completed",
          updatedOn: "2026-01-01T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText(/Subscription details/i)).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid On:/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
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
