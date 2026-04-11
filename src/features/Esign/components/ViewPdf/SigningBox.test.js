import React from "react";

import SigningBox from "./SigningBox";
import { fireEvent, render, screen } from "@testing-library/react";

describe("SigningBox Tests", () => {
  describe("SigningBox Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <SigningBox
          pageOffsets={{ current: { 1: 10 } }}
          createdBox={{
            id: "box1",
            signerRole: "Creator",
            pageNum: 1,
            screenX: 100,
            screenY: 200,
            screenW: 150,
            screenH: 50,
            color: "#2563eb",
          }}
          removeBox={jest.fn()}
          scrollTop={0}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("SigningBox component tests", () => {
    const mockRemoveBox = jest.fn();

    const createdBox = {
      id: "box1",
      signerRole: "Creator",
      pageNum: 1,
      screenX: 100,
      screenY: 200,
      screenW: 150,
      screenH: 50,
      color: "#2563eb",
    };

    const pageOffsets = {
      current: {
        1: 10,
      },
    };

    it("renders signer role", () => {
      render(
        <SigningBox
          pageOffsets={pageOffsets}
          createdBox={createdBox}
          removeBox={mockRemoveBox}
          scrollTop={0}
        />,
      );

      expect(screen.getByText("Creator")).toBeInTheDocument();
    });

    it("calls removeBox when delete icon is clicked", () => {
      const { container } = render(
        <SigningBox
          pageOffsets={pageOffsets}
          createdBox={createdBox}
          removeBox={mockRemoveBox}
          scrollTop={0}
        />,
      );

      const deleteButton = container.querySelector("svg");

      fireEvent.click(deleteButton);

      expect(mockRemoveBox).toHaveBeenCalledWith("box1");
    });
  });
});
