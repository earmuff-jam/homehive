import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecieverInfo from "./RecieverInfo";

// Mock dependencies
jest.mock("hooks/useAppTitle", () => ({
  useAppTitle: jest.fn(),
}));

jest.mock("common/RowHeader/RowHeader", () => ({
  __esModule: true,
  default: ({ title, caption }) => (
    <div>
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

jest.mock("features/Invoice/components/UserInfo/UserInfoViewer", () => ({
  __esModule: true,
  default: ({ onSubmit }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ first_name: "John" }); }}>
      <button type="submit">Submit</button>
    </form>
  ),
}));


describe("RecieverInfo component", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <RecieverInfo />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

});
