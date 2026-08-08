import React from "react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import SenderInfo from "./SenderInfo";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import {
  useGetInvoiceListQuery,
  useGetSenderInfoQuery,
} from "features/Api/invoiceApi";
import InvoiceMockValues from "features/Invoice/mockConstants";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  useGetSenderInfoQuery: vi.fn(),
  useGetInvoiceListQuery: vi.fn(),
  useUpsertSenderInfoMutation: () => [
    vi.fn(),
    { isLoading: false, isSuccess: false },
  ],
}));

describe("SenderInfo component snapshot test", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useGetSenderInfoQuery.mockReturnValue({
      data: InvoiceMockValues.senderDetails,
      isLoading: false,
      isSuccess: true,
    });

    useGetInvoiceListQuery.mockReturnValue({
      data: {
        invoiceDetails: InvoiceMockValues.invoiceDetails,
        senderDetails: InvoiceMockValues.senderDetails,
        receiverDetails: InvoiceMockValues.receiverDetails,
      },
      isLoading: false,
      isSuccess: true,
    });
  });

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
