import React from "react";

import ProfileDetails from "./ProfileDetails";
import { render, screen } from "@testing-library/react";
import { useCreateStripeManageSubscriptionLinkMutation } from "features/Api/externalIntegrationsApi";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useUpdateUserByUidMutation } from "features/Api/firebaseUserApi";
import { useGetLatestSubscriptionByEmailQuery } from "features/Api/subscriptionApi";

jest.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "test@test.com",
    role: "tenant",
  }),
}));

jest.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: jest.fn(),
  useUpdateUserByUidMutation: jest.fn(),
}));

jest.mock("features/Api/subscriptionApi", () => ({
  useGetLatestSubscriptionByEmailQuery: jest.fn(),
}));

jest.mock("features/Api/externalIntegrationsApi", () => ({
  useCreateStripeManageSubscriptionLinkMutation: jest.fn(),
}));

jest.mock("features/Subscription/SubscriptionGuard", () => ({
  StripePaymentStatusCompleted: "completed",
}));

jest.mock(
  "features/Rent/components/ProfileDetails/ProfileSubscriptionTooltip",
  () => ({
    ProfileSubscriptionTooltip: () => (
      <div data-testid="subscription-tooltip" />
    ),
  }),
);

jest.mock("common/AButton", () => (props) => (
  <button {...props}>{props.label}</button>
));

jest.mock("common/TextFieldWithLabel", () => (props) => <input {...props} />);

jest.mock("common/RowHeader", () => () => <div data-testid="row-header" />);

jest.mock(
  "common/CustomSnackbar",
  () => (props) => (props.showSnackbar ? <div data-testid="snackbar" /> : null),
);

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
      jest.fn(),
      { isLoading: false, isSuccess: false },
    ]);

    useUpdateUserByUidMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isSuccess: false },
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
      jest.fn(),
      { isLoading: false, isSuccess: false },
    ]);

    useUpdateUserByUidMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isSuccess: false },
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
      jest.fn(),
      { isLoading: false, isSuccess: false },
    ]);

    useUpdateUserByUidMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false, isSuccess: false },
    ]);

    const { container } = render(<ProfileDetails />);

    expect(container).toMatchSnapshot();
  });
});
