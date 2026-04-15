import React from "react";

import ViewTokenMenu from "./ViewTokenMenu";
import { fireEvent, render, screen } from "@testing-library/react";

// mock user util
jest.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "123",
    email: "test@example.com",
  }),
}));

const mockTrigger = jest.fn();

jest.mock("features/Api/externalIntegrationsApi", () => ({
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
      handleClose: jest.fn(),
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
      handleClose: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
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
      jest
        .spyOn(
          require("features/Api/externalIntegrationsApi"),
          "usePurchaseTokenCheckoutSessionMutation",
        )
        .mockReturnValue([
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
