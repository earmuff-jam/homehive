import React from "react";

import AddSigner from "./AddSigner";
import { fireEvent, render, screen } from "@testing-library/react";

describe("AddSigner Tests", () => {
  const signers = [
    { id: "1", role: "Creator", color: "#2563eb" },
    { id: "2", role: "Signer 1", color: "#16a34a" },
  ];

  const mockSetActiveSigner = jest.fn();
  const mockUpdateSignerDetails = jest.fn();
  const mockAddSigner = jest.fn();
  const mockRemoveSigner = jest.fn();

  const defaultProps = {
    signers,
    activeSigner: signers[0],
    handleSelectSigner: mockSetActiveSigner,
    updateSignerDetails: mockUpdateSignerDetails,
    addFollowUpSigners: mockAddSigner,
    handleRemoveSigner: mockRemoveSigner,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders signers and allows interactions", () => {
    render(<AddSigner {...defaultProps} />);

    // renders chip
    expect(screen.getByText("Signer 1")).toBeInTheDocument();

    // click chip
    fireEvent.click(screen.getByText("Signer 1"));
    expect(mockSetActiveSigner).toHaveBeenCalledWith(signers[1]);

    // delete signer
    const deleteIcons = document.querySelectorAll(".MuiChip-deleteIcon");
    fireEvent.click(deleteIcons[0]);

    expect(mockRemoveSigner).toHaveBeenCalledWith("1");
  });

  it("calls addFollowUpSigners when button clicked", () => {
    render(<AddSigner {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Add new signer/i }));

    expect(mockAddSigner).toHaveBeenCalled();
  });
});
