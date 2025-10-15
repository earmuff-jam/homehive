import React from "react";

import BreadCrumbs from "./BreadCrumbs";
import { HomeRounded } from "@mui/icons-material";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
  MemoryRouter: ({ children }) => <div>{children}</div>,
}));

jest.mock("common/utils", () => ({
  HomeRouteUri: "/home",
}));

// currentRoute?.config?.breadcrumb?.icon
const mockCurrentRouteData = {
  config: {
    breadcrumb: {
      icon: <HomeRounded />,
      value: "Mohit Home",
    },
  },
};

describe("Breadcrumbs tests", () => {
  describe("Breadcrubms snapshot test", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(<BreadCrumbs />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("Breadcrumbs component test", () => {
    it("shows Home link", () => {
      render(<BreadCrumbs currentRoute={mockCurrentRouteData} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    it("navigates to home when Home is clicked", () => {
      const mockNavigate = jest.fn();
      require("react-router-dom").useNavigate = () => mockNavigate;
      require("react-router-dom").useLocation = () => ({
        pathname: "/something",
      });

      render(<BreadCrumbs currentRoute={null} />);
      fireEvent.click(screen.getByRole("link"));
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });

    it("shows current breadcrumb text and icon", () => {
      require("react-router-dom").useLocation = () => ({
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
      require("react-router-dom").useLocation = () => ({
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
      require("react-router-dom").useLocation = () => ({ pathname: "/random" });

      render(<BreadCrumbs />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.queryByText("random")).not.toBeInTheDocument();
    });
  });
});
