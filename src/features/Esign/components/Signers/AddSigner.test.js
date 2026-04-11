import React from "react";

import AddSigner from "./AddSigner";
import { fireEvent, render, screen } from "@testing-library/react";

describe("AddSigner Tests", () => {
  describe("AddSigner Snapshot", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <AddSigner
          signers={[
            { id: "1", role: "Creator", color: "#2563eb" },
            { id: "2", role: "Signer 1", color: "#16a34a" },
          ]}
          activeSigner={{ id: "1", role: "Creator", color: "#2563eb" }}
          setActiveSigner={jest.fn()}
          updateSignerDetails={jest.fn()}
          addFollowUpSigners={jest.fn()}
          handleRemoveSigner={jest.fn()}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
  describe("AddSigner", () => {
    const mockSetActiveSigner = jest.fn();
    const mockUpdateSignerDetails = jest.fn();
    const mockAddSigner = jest.fn();
    const mockRemoveSigner = jest.fn();

    const signers = [
      {
        id: "1",
        role: "Creator",
        color: "#2563eb",
      },
      {
        id: "2",
        role: "Signer 1",
        color: "#16a34a",
      },
    ];

    it("renders signers and allows interactions", () => {
      render(
        <AddSigner
          signers={signers}
          activeSigner={signers[0]}
          setActiveSigner={mockSetActiveSigner}
          updateSignerDetails={mockUpdateSignerDetails}
          addFollowUpSigners={mockAddSigner}
          handleRemoveSigner={mockRemoveSigner}
        />,
      );

      expect(screen.getByText("Signer 1")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Signer 1"));
      expect(mockSetActiveSigner).toHaveBeenCalledWith(signers[1]);

      const deleteIcons = document.querySelectorAll(".MuiChip-deleteIcon");
      fireEvent.click(deleteIcons[0]);
      expect(mockRemoveSigner).toHaveBeenCalledWith("1");
    });
  });
});
