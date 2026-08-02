import React from "react";

import dayjs from "dayjs";

import FileDetails from "./FileDetails";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("FileDetails Component", () => {
  describe("FileDetails Snapshot tests", () => {
    it("matches FileDetails snapshot", () => {
      const { asFragment } = render(<FileDetails />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("FileDetails Component tests", () => {
    it("renders empty state when no file is selected", () => {
      render(<FileDetails selectedFile={null} reset={vi.fn()} />);

      const emptyMsg = screen.getAllByText(
        /select a pdf file to validate and upload/i,
      );

      expect(emptyMsg.length).toBeGreaterThan(0);
    });

    it("renders file details and calls reset when close button is clicked", () => {
      const mockReset = vi.fn();

      const fakeFile = {
        file: new File(["dummy"], "example.pdf", {
          type: "application/pdf",
        }),
        size: "1.23",
        created: dayjs().toISOString(),
        updated: dayjs().toISOString(),
        lastModified: Date.now(),
      };

      render(<FileDetails selectedFile={fakeFile} reset={mockReset} />);

      expect(screen.getByText(/example\.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/1\.23 mb/i)).toBeInTheDocument();

      const formatted = dayjs(fakeFile.lastModified).format("DD/MM/YYYY");

      expect(
        screen.getByText(`Last modified ${formatted}`),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("mock-aiconbutton"));

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });
});
