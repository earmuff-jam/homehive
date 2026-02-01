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

jest.mock(
  "features/Rent/components/EsignConnect/EsignAgreement",
  () =>
    ({ isEsignLinkDisabled }) => (
      <button disabled={isEsignLinkDisabled}>Link Esign</button>
    ),
);

jest.mock("features/Api/firebaseUserApi", () => ({
  useUpdateUserByUidMutation: jest.fn(() => [
    jest.fn(),
    {
      isSuccess: false,
      isLoading: false,
    },
  ]),
}));

describe("StatusCard tests", () => {
  const defaultProps = {
    isEsignConnected: false,
    disconnectEsign: jest.fn(),
    esignAccountWorkspaceId: "WS-123",
  };

  describe("snapshot tests", () => {
    it("matches snapshot when not connected", () => {
      const { asFragment } = render(<StatusCard {...defaultProps} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("component behavior tests", () => {
    test("renders disabled Link Esign button when not connected", () => {
      render(<StatusCard {...defaultProps} />);

      const button = screen.getByText("Link Esign");

      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    test("renders workspace details when connected", () => {
      render(<StatusCard {...defaultProps} isEsignConnected={true} />);

      expect(screen.getByText("Esign Workspace ID:")).toBeInTheDocument();
      expect(screen.getByText("WS-123")).toBeInTheDocument();
      expect(screen.getByText("Online")).toBeInTheDocument();
    });
  });
});
