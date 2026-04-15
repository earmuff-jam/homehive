import React from "react";
import ViewSigningFields from "./ViewSigningFields";
import { fireEvent, render, screen } from "@testing-library/react";

describe("ViewSigningFields Tests", () => {
  describe("Snapshot Tests", () => {
    const signatureBoxes = [
      {
        id: "box1",
        signerRole: "Creator",
        pageNum: 1,
        color: "#2563eb",
        fieldType: "signature",
      },
    ];

    it("matches snapshot", () => {
      const { container } = render(
        <ViewSigningFields
          signatureBoxes={signatureBoxes}
          removeBox={jest.fn()}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("Component Tests", () => {
    const mockRemoveBox = jest.fn();

    const signatureBoxes = [
      {
        id: "box1",
        signerRole: "Creator",
        pageNum: 1,
        color: "#2563eb",
        fieldType: "signature",
      },
      {
        id: "box2",
        signerRole: "Signer 2",
        pageNum: 2,
        color: "#16a34a",
        fieldType: "date",
      },
    ];

    it("renders placed signature fields", () => {
      render(
        <ViewSigningFields
          signatureBoxes={signatureBoxes}
          removeBox={mockRemoveBox}
        />,
      );

      expect(screen.getByText("Placed Fields")).toBeInTheDocument();

      expect(
        screen.getByText("Creator — Page 1"),
      ).toBeInTheDocument();

      expect(
        screen.getByText("Signer 2 (Date) — Page 2"),
      ).toBeInTheDocument();
    });

    it("calls removeBox when delete icon is clicked", () => {
      render(
        <ViewSigningFields
          signatureBoxes={signatureBoxes}
          removeBox={mockRemoveBox}
        />,
      );

      const deleteIcons = document.querySelectorAll(
        ".MuiChip-deleteIcon",
      );

      fireEvent.click(deleteIcons[0]);

      expect(mockRemoveBox).toHaveBeenCalledWith("box1");
    });
  });
});