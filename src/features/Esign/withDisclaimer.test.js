import React from "react";

import withDisclaimer from "./withDisclaimer";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

const MockComponent = () => (
  <div data-testid="wrapped-component">Main Content</div>
);
const WrappedComponent = withDisclaimer(MockComponent);

describe("withDisclaimer tests", () => {
  describe("withDisclaimer Snapshot tests", () => {
    const MockComponent = () => <div>Main Content</div>;
    const WrappedComponent = withDisclaimer(MockComponent);

    describe("withDisclaimer Snapshot tests", () => {
      it("matches snapshot when dialog is open", () => {
        const { container } = render(<WrappedComponent />);
        expect(container).toMatchSnapshot();
      });

      it("matches snapshot when dialog is closed", () => {
        const { container, getByRole, getByText } = render(
          <WrappedComponent />,
        );

        fireEvent.click(getByRole("checkbox"));
        fireEvent.click(getByText("I Understand"));

        expect(container).toMatchSnapshot();
      });
    });
  });
  describe("withDisclaimer Component Tests", () => {
    it("shows disclaimer dialog on first render", () => {
      render(<WrappedComponent />);

      expect(screen.getByText("Platform Disclaimer")).toBeInTheDocument();
      expect(screen.getByText("I Understand")).toBeDisabled();
    });

    it("hides dialog when clicking I Understand after checking checkbox", () => {
      render(<WrappedComponent />);

      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByText("I Understand"));

      expect(screen.getByTestId("wrapped-component")).toBeInTheDocument();
    });

    it("disables button until checkbox is checked", () => {
      render(<WrappedComponent />);

      const button = screen.getByText("I Understand");
      expect(button).toBeDisabled();

      fireEvent.click(screen.getByRole("checkbox"));
      expect(button).toBeEnabled();
    });

    it("renders wrapped component after acknowledgment", () => {
      render(<WrappedComponent />);

      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByText("I Understand"));

      expect(screen.getByTestId("wrapped-component")).toBeInTheDocument();
      expect(screen.getByText("Main Content")).toBeInTheDocument();
    });

    it("displays all disclaimer paragraphs", () => {
      render(<WrappedComponent />);

      expect(
        screen.getByText(/property owner, manager, or broker/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/document automation and electronic signature/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/consult a qualified attorney/i),
      ).toBeInTheDocument();
    });

    it("displays privacy policy checkbox with correct label", () => {
      render(<WrappedComponent />);

      expect(
        screen.getByText("I have read and understood the policy stated above."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("I agree with the privacy policy stated above"),
      ).toBeInTheDocument();
    });
  });
});
