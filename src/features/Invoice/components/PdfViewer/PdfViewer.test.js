import React from "react";

import { MemoryRouter } from "react-router-dom";

import PdfViewer from "./PdfViewer";
import { render } from "@testing-library/react";

test("PdfViewer snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <PdfViewer />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
