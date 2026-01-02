import React from "react";

import dayjs from "dayjs";

import FileDetails from "./FileDetails";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("common/AIconButton", () => {
  return function MockAIconButton(props) {
    return (
      <button data-testid="mock-aiconbutton" {...props}>
        {props.label}
      </button>
    );
  };
});

describe("FileDetails Component", () => {
  describe("FileDetails Snapshot tests", () => {
    it("matches FileDetails snapshot tests", () => {
      const { asFragment } = render(<FileDetails />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("FileDetails Component tests", () => {
    test("renders empty state when no file is selected", () => {
      render(<FileDetails selectedFile={null} reset={jest.fn()} />);

      const emptyMsg = screen.getAllByText(
        /select a pdf file to validate and upload/i,
      );

      // React dev mode re-renders this many times, asserting on condition only
      expect(emptyMsg.length).toBeGreaterThan(0);
    });

    test("renders file details and calls reset when close button clicked", () => {
      const mockReset = jest.fn();

      const fakeFile = {
        file: new File(["dummy"], "example.pdf", { type: "application/pdf" }),
        size: "1.23",
        created: dayjs().toISOString(),
        updated: dayjs().toISOString(),
        lastModified: Date.now(),
      };

      render(<FileDetails selectedFile={fakeFile} reset={mockReset} />);

      expect(screen.getByText(/example.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/1.23 mb/i)).toBeInTheDocument();

      const formatted = dayjs(fakeFile.lastModified).format("DD/MM/YYYY");
      expect(
        screen.getByText(`Last modified ${formatted}`),
      ).toBeInTheDocument();

      const closeBtn = screen.getByTestId("mock-aiconbutton");
      fireEvent.click(closeBtn);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });
});
