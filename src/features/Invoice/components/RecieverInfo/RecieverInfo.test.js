import React from "react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import RecieverInfo from "./RecieverInfo";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";

jest.mock("hooks/useAppTitle", () => ({
  useAppTitle: jest.fn(),
}));

jest.mock("common/RowHeader", () => ({
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ firstName: "John" });
      }}
    >
      <button type="submit">Submit</button>
    </form>
  ),
}));

jest.mock("features/Api/invoiceApi", () => ({
  useGetReceiverInfoQuery: () => ({
    data: {},
    isLoading: false,
    isSuccess: true,
  }),
  useUpsertReceiverInfoMutation: () => [
    jest.fn(),
    { isLoading: false, isSuccess: false },
  ],
}));

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

describe("RecieverInfo component", () => {
  it("renders correctly and matches snapshot", () => {
    const store = configureStore({ reducer: () => ({}) });

    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter>
          <RecieverInfo />
        </MemoryRouter>
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
