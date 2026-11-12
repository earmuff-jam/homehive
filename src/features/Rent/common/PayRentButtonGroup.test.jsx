import React from "react";

import PayRentButtonGroup from "./PayRentButtonGroup";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockGetUserDataByIdQuery,
  mockHandleStripeClick,
  mockHandleCashAppClick,
} = vi.hoisted(() => ({
  mockGetUserDataByIdQuery: vi.fn(),
  mockHandleStripeClick: vi.fn(),
  mockHandleCashAppClick: vi.fn(),
}));

vi.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({ uid: "user-1" }),
}));

vi.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: (...args) => mockGetUserDataByIdQuery(...args),
}));

vi.mock("features/Rent/constants", () => ({
  STRIPE_PAYMENT_VALUE: "STRIPE",
  DefaultRentPaymentOptions: [
    { id: "stripe", label: "Pay with Card", value: "STRIPE" },
    { id: "cash-app", label: "Pay with Cash App", value: "CASH_APP" },
  ],
}));

vi.mock("common/AButton", () => ({
  default: ({ label, disabled, loading, onClick }) => (
    <button
      type="button"
      disabled={disabled}
      data-loading={loading}
      onClick={onClick}
    >
      {label}
    </button>
  ),
}));

const defaultProps = {
  isStripeStatusLoading: false,
  isStripeValid: true,
  isCashAppValid: true,
  handleStripeClick: mockHandleStripeClick,
  handleCashAppClick: mockHandleCashAppClick,
  isRentPaymentSuccessForCurrentMonth: false,
};

describe("PayRentButtonGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUserDataByIdQuery.mockReturnValue({
      data: {},
    });
  });

  it("renders the default payment option", () => {
    render(<PayRentButtonGroup {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Pay with Card" }),
    ).toBeInTheDocument();
  });

  it("uses the user's preferred payment method", () => {
    mockGetUserDataByIdQuery.mockReturnValue({
      data: {
        preferredMethodOfRentPayment: "CASH_APP",
      },
    });

    render(<PayRentButtonGroup {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Pay with Cash App" }),
    ).toBeInTheDocument();
  });

  it("calls the Stripe handler when Stripe is selected", () => {
    render(<PayRentButtonGroup {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Pay with Card" }));

    expect(mockHandleStripeClick).toHaveBeenCalledTimes(1);
    expect(mockHandleCashAppClick).not.toHaveBeenCalled();
  });

  it("calls the Cash App handler when Cash App is selected", () => {
    mockGetUserDataByIdQuery.mockReturnValue({
      data: {
        preferredMethodOfRentPayment: "CASH_APP",
      },
    });

    render(<PayRentButtonGroup {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Pay with Cash App" }));

    expect(mockHandleCashAppClick).toHaveBeenCalledTimes(1);
    expect(mockHandleStripeClick).not.toHaveBeenCalled();
  });

  it("allows the user to change the payment method", async () => {
    render(<PayRentButtonGroup {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", { name: "select merge strategy" }),
    );

    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Pay with Cash App" }),
    );

    expect(
      screen.getByRole("button", { name: "Pay with Cash App" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Pay with Cash App" }));

    expect(mockHandleCashAppClick).toHaveBeenCalledTimes(1);
  });

  it("disables the Stripe payment button when Stripe is invalid", () => {
    render(<PayRentButtonGroup {...defaultProps} isStripeValid={false} />);

    expect(
      screen.getByRole("button", { name: "Pay with Card" }),
    ).toBeDisabled();
  });

  it("disables the Cash App payment button when Cash App is invalid", () => {
    mockGetUserDataByIdQuery.mockReturnValue({
      data: {
        preferredMethodOfRentPayment: "CASH_APP",
      },
    });

    render(<PayRentButtonGroup {...defaultProps} isCashAppValid={false} />);

    expect(
      screen.getByRole("button", { name: "Pay with Cash App" }),
    ).toBeDisabled();
  });

  it("shows the Stripe loading state", () => {
    render(<PayRentButtonGroup {...defaultProps} isStripeStatusLoading />);

    expect(
      screen.getByRole("button", { name: "Pay with Card" }),
    ).toHaveAttribute("data-loading", "true");
  });

  it("disables the dropdown when rent has already been paid", () => {
    render(
      <PayRentButtonGroup
        {...defaultProps}
        isRentPaymentSuccessForCurrentMonth
      />,
    );

    expect(
      screen.getByRole("button", { name: "select merge strategy" }),
    ).toBeDisabled();
  });

  it("fetches the logged-in user's payment preferences", () => {
    render(<PayRentButtonGroup {...defaultProps} />);

    expect(mockGetUserDataByIdQuery).toHaveBeenCalledWith("user-1", {
      skip: false,
    });
  });
});
