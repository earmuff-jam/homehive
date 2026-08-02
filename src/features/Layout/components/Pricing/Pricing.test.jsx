import React from "react";

import Pricing from "./Pricing";
import { fireEvent, render, screen } from "@testing-library/react";
import * as externalIntegrationsApi from "features/Api/externalIntegrationsApi";
import { beforeEach, describe, expect, it, test, vi } from "vitest";

vi.mock("features/Api/externalIntegrationsApi", () => ({
  useGetSubscriptionOptionsQuery: vi.fn(),
}));

vi.mock("features/Rent/utils", () => ({
  formatCurrency: vi.fn((val) => val),
}));

describe("Pricing tests", () => {
  const mockSetSelectedSubscription = vi.fn();

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
    vi.clearAllMocks();
  });

  describe("snapshot tests", () => {
    it("matches snapshot", () => {
      vi.mocked(
        externalIntegrationsApi.useGetSubscriptionOptionsQuery,
      ).mockReturnValue({
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
      vi.mocked(
        externalIntegrationsApi.useGetSubscriptionOptionsQuery,
      ).mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      render(<Pricing {...defaultProps} />);

      expect(screen.getByText("Basic")).toBeInTheDocument();
      expect(screen.getByText("Pro")).toBeInTheDocument();
    });

    test("calls setSelectedSubscription when plan clicked", () => {
      vi.mocked(
        externalIntegrationsApi.useGetSubscriptionOptionsQuery,
      ).mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      render(<Pricing {...defaultProps} />);

      fireEvent.click(screen.getByText("Basic"));

      expect(mockSetSelectedSubscription).toHaveBeenCalledWith(mockPlans[0]);
    });

    test("shows skeleton when loading", () => {
      vi.mocked(
        externalIntegrationsApi.useGetSubscriptionOptionsQuery,
      ).mockReturnValue({
        data: [],
        isLoading: true,
        isSuccess: false,
      });

      const { container } = render(<Pricing {...defaultProps} />);

      expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
    });

    test("sets default subscription on load", () => {
      vi.mocked(
        externalIntegrationsApi.useGetSubscriptionOptionsQuery,
      ).mockReturnValue({
        data: mockPlans,
        isLoading: false,
        isSuccess: true,
      });

      render(<Pricing {...defaultProps} />);

      expect(mockSetSelectedSubscription).toHaveBeenCalledWith(mockPlans[1]);
    });
  });
});
