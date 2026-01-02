import React from "react";

import StatusCard from "./StatusCard";
import { render, screen } from "@testing-library/react";

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("common/AIconButton", () => {
  return function MockAIconButton(props) {
    return (
      <button data-testid="mock-aiconbutton" {...props}>
        {props.label}
      </button>
    );
  };
});

describe("StatusCard tests", () => {
  describe("StatusCard snapshot tests", () => {
    it("matches AddRentRecords snapshot", () => {
      const defaultProps = {
        isEsignConnected: false,
        handleClick: jest.fn(),
        connectEsign: jest.fn(),
        isUpdateUserLoading: false,
        esignAccountWorkspaceId: "WS-123",
      };
      const { asFragment } = render(<StatusCard {...defaultProps} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("StatusCard component tests", () => {
    const defaultProps = {
      isEsignConnected: false,
      handleClick: jest.fn(),
      connectEsign: jest.fn(),
      isUpdateUserLoading: false,
      esignAccountWorkspaceId: "WS-123",
    };

    test("renders Link Esign button when not connected", () => {
      render(<StatusCard {...defaultProps} />);

      expect(screen.getByText("Link Esign")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Link with our provider esign account for easy access for signed documents.",
        ),
      ).toBeInTheDocument();
    });

    test("renders workspace details when connected", () => {
      render(<StatusCard {...defaultProps} isEsignConnected={true} />);

      expect(screen.getByText("Esign Workspace ID:")).toBeInTheDocument();
      expect(screen.getByText("WS-123")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();
    });
  });
});
