import React from "react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import SenderInfo from "./SenderInfo";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("hooks/useAppTitle", () => ({
  useAppTitle: vi.fn(),
}));

vi.mock("common/CustomSnackbar", () => ({
  __esModule: true,
  default: ({ showSnackbar }) =>
    showSnackbar ? <div data-testid="snackbar">Changes saved.</div> : null,
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
        onSubmit({ first_name: "John" });
      }}
    >
      <button type="submit">Submit</button>
    </form>
  ),
}));

vi.mock("features/Api/invoiceApi", () => ({
  useGetSenderInfoQuery: () => ({
    data: {},
    isLoading: false,
    isSuccess: true,
  }),
  useUpsertSenderInfoMutation: () => [
    vi.fn(),
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
