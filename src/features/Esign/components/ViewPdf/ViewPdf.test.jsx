import React from "react";

import ViewPdf from "./ViewPdf";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("ViewPdf Tests", () => {
  describe("ViewPdf Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <ViewPdf
          containerRef={React.createRef()}
          activeSigner={null}
          setScrollTop={vi.fn()}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("ViewPdf Component Tests", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <ViewPdf
          containerRef={React.createRef()}
          activeSigner={null}
          setScrollTop={vi.fn()}
        />,
      );

      expect(container).toBeInTheDocument;
    });

    it("calls setScrollTop on scroll", () => {
      const mockSetScrollTop = vi.fn();

      const { container } = render(
        <ViewPdf
          containerRef={React.createRef()}
          activeSigner={null}
          setScrollTop={mockSetScrollTop}
        />,
      );

      const scrollContainer = container.firstChild;

      fireEvent.scroll(scrollContainer, {
        target: { scrollTop: 120 },
      });

      expect(mockSetScrollTop).toHaveBeenCalled();
    });
  });
});
