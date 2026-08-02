import React from "react";

import ProfileDetails from "./ProfileDetails";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { useCreateStripeManageSubscriptionLinkMutation } from "features/Api/externalIntegrationsApi";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import { useGetLatestSubscriptionByEmailQuery } from "features/Api/subscriptionApi";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("common/utils", () => ({
  __esModule: true,
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "test@test.com",
    role: "tenant",
  }),
}));

vi.mock("features/Api/firebaseUserApi", () => ({
  __esModule: true,
  useGetUserDataByIdQuery: vi.fn(),
  useUpdateUserByUidMutation: vi.fn(),
}));

vi.mock("features/Api/subscriptionApi", () => ({
  __esModule: true,
  useGetLatestSubscriptionByEmailQuery: vi.fn(),
}));

vi.mock("features/Api/externalIntegrationsApi", () => ({
  __esModule: true,
  useCreateStripeManageSubscriptionLinkMutation: vi.fn(),
}));

vi.mock("features/Subscription/SubscriptionGuard", () => ({
  __esModule: true,
  StripePaymentStatusCompleted: "completed",
}));

vi.mock(
  "features/Rent/components/ProfileDetails/ProfileSubscriptionTooltip",
  () => ({
    __esModule: true,
    ProfileSubscriptionTooltip: () => (
      <div data-testid="subscription-tooltip" />
    ),
  }),
);

vi.mock("common/TextFieldWithLabel", () => ({
  __esModule: true,
  default: (props) => <input {...props} />,
}));

vi.mock("common/RowHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="row-header" />,
}));

const resetMocks = () => {
  useGetUserDataByIdQuery.mockReset();
  useGetLatestSubscriptionByEmailQuery.mockReset();
  useCreateStripeManageSubscriptionLinkMutation.mockReset();
  useUpdateUserByUidMutation.mockReset();
};

describe("ProfileDetails", () => {
  afterEach(() => resetMocks());

  it("shows loading skeleton", () => {
    useGetUserDataByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    useGetLatestSubscriptionByEmailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    useCreateStripeManageSubscriptionLinkMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
      },
    ]);

    useUpdateUserByUidMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
      },
    ]);

    const { container } = render(<ProfileDetails />);

    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("renders user profile", () => {
    useGetUserDataByIdQuery.mockReturnValue({
      data: {
        googleDisplayName: "John Doe",
        email: "test@test.com",
        googlePhotoURL: "",
        googleLastLoginAt: new Date().toISOString(),
      },
      isLoading: false,
    });

    useGetLatestSubscriptionByEmailQuery.mockReturnValue({
      data: {},
      isLoading: false,
    });

    useCreateStripeManageSubscriptionLinkMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
      },
    ]);

    useUpdateUserByUidMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
      },
    ]);

    render(<ProfileDetails />);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    useGetUserDataByIdQuery.mockReturnValue({
      data: {
        googleDisplayName: "John Doe",
        email: "test@test.com",
        googlePhotoURL: "",
        googleLastLoginAt: new Date().toISOString(),
      },
      isLoading: false,
    });

    useGetLatestSubscriptionByEmailQuery.mockReturnValue({
      data: {},
      isLoading: false,
    });

    useCreateStripeManageSubscriptionLinkMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
      },
    ]);

    useUpdateUserByUidMutation.mockReturnValue([
      vi.fn(),
      {
        isLoading: false,
        isSuccess: false,
      },
    ]);

    const { container } = render(<ProfileDetails />);

    expect(container).toMatchSnapshot();
  });
});
