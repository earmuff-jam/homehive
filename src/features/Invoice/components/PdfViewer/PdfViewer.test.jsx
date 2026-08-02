import React from "react";

import { MemoryRouter } from "react-router-dom";

import PdfViewer from "./PdfViewer";
import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useOutletContext: () => [false], // mock value for showWatermark
  };
});

test("PdfViewer snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <PdfViewer />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
