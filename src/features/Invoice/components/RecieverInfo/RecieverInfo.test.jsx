import React from "react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import RecieverInfo from "./RecieverInfo";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("hooks/useAppTitle", () => ({
  useAppTitle: vi.fn(),
}));

vi.mock("common/RowHeader", () => ({
  __esModule: true,
  default: ({ title, caption }) => (
    <div>
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

vi.mock("features/Invoice/components/UserInfo/UserInfoViewer", () => ({
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

vi.mock("features/Api/invoiceApi", () => ({
  useGetReceiverInfoQuery: () => ({
    data: {},
    isLoading: false,
    isSuccess: true,
  }),
  useUpsertReceiverInfoMutation: () => [
    vi.fn(),
    { isLoading: false, isSuccess: false },
  ],
}));

vi.mock("common/AButton", () => ({
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
