import React from "react";

import SigningBox from "./SigningBox";
import { fireEvent, render, screen } from "@testing-library/react";

describe("SigningBox Tests", () => {
  const pageOffsets = {
    current: { 1: 10 },
  };

  const baseProps = {
    pageOffsets,
    scrollTop: 0,
    removeBox: jest.fn(),
  };

  const createdBox = {
    id: "box1",
    signerRole: "Creator",
    pageNum: 1,
    screenX: 100,
    screenY: 200,
    screenW: 150,
    screenH: 50,
    color: "#2563eb",
    fieldType: "signature", // ✅ REQUIRED NOW
  };

  describe("Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <SigningBox {...baseProps} createdBox={createdBox} />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("Component Tests", () => {
    it("renders signer role and field type", () => {
      render(<SigningBox {...baseProps} createdBox={createdBox} />);

      expect(screen.getByText(/Creator/)).toBeInTheDocument();
      expect(screen.getByText(/signature/i)).toBeInTheDocument();
    });

    it("calls removeBox when delete icon is clicked", () => {
      const mockRemoveBox = jest.fn();

      const { container } = render(
        <SigningBox
          {...baseProps}
          createdBox={createdBox}
          removeBox={mockRemoveBox}
        />,
      );

      const deleteIcon = container.querySelector("svg");

      fireEvent.click(deleteIcon);

      expect(mockRemoveBox).toHaveBeenCalledWith("box1");
    });
  });
});
