import React from "react";

import ViewTokenMenu from "./ViewTokenMenu";
import { fireEvent, render, screen } from "@testing-library/react";
import * as externalIntegrationsApi from "features/Api/externalIntegrationsApi";
import { beforeEach, describe, expect, it, vi } from "vitest";

// mock user util
vi.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "123",
    email: "test@example.com",
  }),
}));

const mockTrigger = vi.fn();

vi.mock("features/Api/externalIntegrationsApi", () => ({
  usePurchaseTokenCheckoutSessionMutation: () => [
    mockTrigger,
    {
      isSuccess: false,
      isLoading: false,
      data: null,
    },
  ],
}));

describe("ViewTokenMenu Tests", () => {
  describe("ViewTokenMenu Snapshot tests", () => {
    const defaultProps = {
      open: true,
      anchorEl: document.body,
      handleClose: vi.fn(),
    };

    it("matches snapshot when menu is open", () => {
      const { container } = render(<ViewTokenMenu {...defaultProps} />);
      expect(container).toMatchSnapshot();
    });
  });
  describe("ViewTokenMenu Component tests", () => {
    const defaultProps = {
      open: true,
      label: "2 credits",
      anchorEl: document.body,
      handleClose: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders token options", () => {
      render(<ViewTokenMenu {...defaultProps} />);

      expect(screen.getByText("1 credit")).toBeInTheDocument();
      expect(screen.getByText("2 credits")).toBeInTheDocument();
      expect(screen.getByText("5 credits")).toBeInTheDocument();
    });

    it("calls mutation when clicking an option", () => {
      render(<ViewTokenMenu {...defaultProps} />);

      fireEvent.click(screen.getByText("2 credits"));

      expect(mockTrigger).toHaveBeenCalledWith({
        userId: "123",
        email: "test@example.com",
        label: "2 credits",
        value: "PREMIUM",
      });

      expect(defaultProps.handleClose).toHaveBeenCalled();
    });

    it("redirects on success", () => {
      const url = "https://stripe.com/session";

      // override hook for this test
      vi.spyOn(
        externalIntegrationsApi,
        "usePurchaseTokenCheckoutSessionMutation",
      ).mockReturnValue([
        mockTrigger,
        {
          isSuccess: true,
          data: { url },
        },
      ]);

      delete window.location;
      window.location = { href: url };

      render(<ViewTokenMenu {...defaultProps} />);

      expect(window.location.href).toBe(url);
    });
  });
});
