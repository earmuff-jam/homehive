import React from "react";

import ViewPdf from "./ViewPdf";
import { fireEvent, render } from "@testing-library/react";

describe("ViewPdf Tests", () => {
  describe("ViewPdf Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <ViewPdf
          containerRef={React.createRef()}
          paddingTopPx={20}
          activeSigner={null}
          setScrollTop={jest.fn()}
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
          paddingTopPx={20}
          activeSigner={null}
          setScrollTop={jest.fn()}
        />,
      );

      expect(container).toBeInTheDocument;
    });

    it("calls setScrollTop on scroll", () => {
      const mockSetScrollTop = jest.fn();

      const { container } = render(
        <ViewPdf
          containerRef={React.createRef()}
          paddingTopPx={20}
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
