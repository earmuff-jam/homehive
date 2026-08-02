import React from "react";

import { Provider } from "react-redux";

import AddRentRecords from "./AddRentRecords";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: vi.fn(() => ({
    data: {},
    isLoading: false,
  })),
  useGetUserByEmailAddressQuery: vi.fn(() => ({
    data: {},
    isLoading: false,
  })),
}));

vi.mock("features/Api/tenantsApi", () => ({
  useGetTenantByPropertyIdQuery: vi.fn(() => ({
    data: [],
  })),
}));

vi.mock("features/Api/rentApi", () => ({
  useGetUserDataByIdQuery: vi.fn(() => ({
    data: {},
    isLoading: false,
  })),

  useCreateRentRecordMutation: vi.fn(() => [
    vi.fn(),
    {
      isSuccess: false,
      isLoading: false,
    },
  ]),
}));

describe("AddRentRecords Component Tests", () => {
  describe("AddRentRecords Snapshot Tests", () => {
    it("matches AddRentRecords snapshot", () => {
      const store = configureStore({ reducer: () => ({}) });

      const { asFragment } = render(
        <Provider store={store}>
          <AddRentRecords
            property={{}}
            setShowSnackbar={vi.fn()}
            closeDialog={vi.fn()}
          />
          ,
        </Provider>,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("AddRentRecords Component Tests", () => {
    it("renders without crashing", () => {
      const store = configureStore({ reducer: () => ({}) });

      render(
        <Provider store={store}>
          <AddRentRecords
            property={{}}
            setShowSnackbar={vi.fn()}
            closeDialog={vi.fn()}
          />
        </Provider>,
      );

      expect(
        screen.getByText("Property Owner Information"),
      ).toBeInTheDocument();
      expect(screen.getByText("Tenant Information")).toBeInTheDocument();
      expect(screen.getByText("Rent Information")).toBeInTheDocument();
    });
  });
});
