import React from "react";

import ViewTokenAlert, {
  LOW_TOKEN_TEXT,
  NO_TOKEN_TEXT,
} from "./ViewTokenAlert";
import { render, screen } from "@testing-library/react";

const renderComponent = (tokenCount) => {
  return render(<ViewTokenAlert tokenCount={tokenCount} />);
};

describe("ViewTokenAlert Tests", () => {
  describe("ViewTokenAlert Snapshot tests", () => {
    it("tokenCount = 0", () => {
      const { asFragment } = render(<ViewTokenAlert tokenCount={0} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("ViewTokenAlert Component Tests", () => {
    describe("when tokenCount is 0 or undefined", () => {
      it("shows no token warning when tokenCount is 0", () => {
        renderComponent(0);
        expect(screen.getByText(NO_TOKEN_TEXT)).toBeInTheDocument();
      });

      it("defaults to 0 and shows no token warning", () => {
        renderComponent();
        expect(screen.getByText(NO_TOKEN_TEXT)).toBeInTheDocument();
      });
    });

    describe("when tokenCount is low (1-2)", () => {
      it("shows low token warning when tokenCount is 1", () => {
        renderComponent(1);
        expect(screen.getByText(LOW_TOKEN_TEXT)).toBeInTheDocument();
      });

      it("shows low token warning when tokenCount is 2", () => {
        renderComponent(2);
        expect(screen.getByText(LOW_TOKEN_TEXT)).toBeInTheDocument();
      });
    });

    describe("when tokenCount is sufficient", () => {
      it("does not show any alert when tokenCount > 2", () => {
        renderComponent(3);
        expect(screen.queryByText(LOW_TOKEN_TEXT)).not.toBeInTheDocument();
        expect(screen.queryByText(NO_TOKEN_TEXT)).not.toBeInTheDocument();
      });
    });
  });
});
