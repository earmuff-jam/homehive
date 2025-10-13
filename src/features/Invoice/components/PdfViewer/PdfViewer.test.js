import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PdfViewer from "./PdfViewer";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useOutletContext: () => [false], // mock value for showWatermark
}));

test("PdfViewer snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <PdfViewer />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
