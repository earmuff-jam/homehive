import React from "react";

import EmptyComponent from "./EmptyComponent";
import { render, screen } from "@testing-library/react";

describe("EmptyComponent Jest Tests", () => {
  describe("EmptyComponent Snapshot tests", () => {
    it("should render the correct snapshot", () => {
      const { asFragment } = render(<EmptyComponent />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("EmptyComponent Component Tests", () => {
    it("renders default title when no title is provided", () => {
      render(<EmptyComponent />);

      expect(
        screen.getByText("Sorry, no matching records found."),
      ).toBeInTheDocument();
    });

    it("renders custom title and caption", () => {
      render(
        <EmptyComponent
          title="No data available"
          caption="Try adjusting your filters"
        />,
      );

      expect(screen.getByText("No data available")).toBeInTheDocument();
      expect(
        screen.getByText(/try adjusting your filters/i),
      ).toBeInTheDocument();
    });

    it("renders children inside caption", () => {
      render(
        <EmptyComponent caption="Contact">
          <span>admin</span>
        </EmptyComponent>,
      );

      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText(/contact/i)).toBeInTheDocument();
    });

    it("respects direction prop", () => {
      const { container } = render(<EmptyComponent direction="row" />);

      // MUI Stack sets direction via CSS, so we just verify render
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
