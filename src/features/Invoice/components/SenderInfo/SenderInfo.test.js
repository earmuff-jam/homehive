import React from "react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import SenderInfo from "./SenderInfo";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";

jest.mock("features/Invoice/components/UserInfo/UserInfoViewer", () => ({
  __esModule: true,
  default: ({ onSubmit }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ first_name: "John" });
      }}
    >
      <button type="submit">Submit</button>
    </form>
  ),
}));

jest.mock("features/Api/invoiceApi", () => ({
  useGetSenderInfoQuery: () => ({
    data: {},
    isLoading: false,
    isSuccess: true,
  }),
  useUpsertSenderInfoMutation: () => [
    jest.fn(),
    { isLoading: false, isSuccess: false },
  ],
}));

describe("SenderInfo component", () => {
  it("renders correctly and matches snapshot", () => {
    const store = configureStore({ reducer: () => ({}) });

    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter>
          <SenderInfo />
        </MemoryRouter>
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
