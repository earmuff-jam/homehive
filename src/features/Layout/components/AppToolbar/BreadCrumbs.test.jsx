import React from "react";

import * as reactRouterDom from "react-router-dom";

import BreadCrumbs from "./BreadCrumbs";
import { HomeRounded } from "@mui/icons-material";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  MemoryRouter: ({ children }) => <>{children}</>,
}));

vi.mock("common/utils", () => ({
  HomeRouteUri: "/home",
}));

const mockCurrentRouteData = {
  config: {
    breadcrumb: {
      icon: <HomeRounded />,
      value: "Mohit Home",
    },
  },
};

describe("Breadcrumbs tests", () => {
  let mockNavigate;

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate = vi.fn();

    vi.mocked(reactRouterDom.useNavigate).mockReturnValue(mockNavigate);

    vi.mocked(reactRouterDom.useLocation).mockReturnValue({
      pathname: "/",
    });
  });

  describe("BreadCrumbs snapshot test", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(<BreadCrumbs />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Breadcrumbs component tests", () => {
    it("shows Home link", () => {
      render(<BreadCrumbs currentRoute={mockCurrentRouteData} />);

      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("navigates to home when Home is clicked", () => {
      vi.mocked(reactRouterDom.useLocation).mockReturnValue({
        pathname: "/something",
      });

      render(<BreadCrumbs currentRoute={null} />);

      fireEvent.click(screen.getByRole("link"));

      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    it("shows current breadcrumb text and icon", () => {
      vi.mocked(reactRouterDom.useLocation).mockReturnValue({
        pathname: "/dashboard",
      });

      const currentRoute = {
        config: {
          breadcrumb: {
            value: "Dashboard",
            icon: <span data-testid="icon">📊</span>,
          },
        },
      };

      render(<BreadCrumbs currentRoute={currentRoute} />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("ignores intermediate paths", () => {
      vi.mocked(reactRouterDom.useLocation).mockReturnValue({
        pathname: "/admin/settings",
      });

      const currentRoute = {
        config: {
          breadcrumb: {
            value: "Settings",
          },
        },
      };

      render(<BreadCrumbs currentRoute={currentRoute} />);

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.queryByText("admin")).not.toBeInTheDocument();
    });

    it("does not render breadcrumb if currentRoute is missing", () => {
      vi.mocked(reactRouterDom.useLocation).mockReturnValue({
        pathname: "/random",
      });

      render(<BreadCrumbs />);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.queryByText("random")).not.toBeInTheDocument();
    });
  });
});
