import React from "react";

import Pricing from "./Pricing";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("features/Api/externalIntegrationsApi", () => ({
  useGetSubscriptionOptionsQuery: jest.fn(),
}));

jest.mock("features/Rent/utils", () => ({
  formatCurrency: jest.fn((val) => val),
}));

const {
  useGetSubscriptionOptionsQuery,
} = require("features/Api/externalIntegrationsApi");

describe("Pricing tests", () => {
  const mockSetSelectedSubscription = jest.fn();

  const mockPlans = [
    {
      productId: "prod_1",
      productName: "Basic",
      priceId: "price_1",
      amount: 500,
      interval: "month",
      description: "Basic plan",
    },
    {
      productId: "prod_2",
      productName: "Pro",
      priceId: "price_2",
      amount: 1500,
      interval: "month",
      description: "Pro plan",
    },
  ];

  const defaultProps = {
    selectedSubscription: null,
    setSelectedSubscription: mockSetSelectedSubscription,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("snapshot tests", () => {
    it("matches snapshot", () => {
      useGetSubscriptionOptionsQuery.mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      const { asFragment } = render(<Pricing {...defaultProps} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("component behavior tests", () => {
    test("renders plans", () => {
      useGetSubscriptionOptionsQuery.mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      render(<Pricing {...defaultProps} />);

      expect(screen.getByText("Basic")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
    });

    test("calls setSelectedSubscription when plan clicked", () => {
      useGetSubscriptionOptionsQuery.mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      render(<Pricing {...defaultProps} />);

      fireEvent.click(screen.getByText("Basic"));

      expect(mockSetSelectedSubscription).toHaveBeenCalledWith(mockPlans[0]);
    });

    test("shows skeleton when loading", () => {
      useGetSubscriptionOptionsQuery.mockReturnValue({
        data: [],
        isLoading: true,
        isSuccess: false,
      });

      const { container } = render(<Pricing {...defaultProps} />);

      expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
    });

    test("sets default subscription on load", () => {
      useGetSubscriptionOptionsQuery.mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      render(<Pricing {...defaultProps} />);

      expect(mockSetSelectedSubscription).toHaveBeenCalledWith(mockPlans[1]);
    });
  });
});
