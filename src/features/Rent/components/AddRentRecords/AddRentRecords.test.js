import React from "react";

import { Provider } from "react-redux";

import AddRentRecords from "./AddRentRecords";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("react-secure-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: jest.fn(() => ({
    data: {},
    isLoading: false,
  })),
  useGetUserByEmailAddressQuery: jest.fn(() => ({
    data: {},
    isLoading: false,
  })),
}));

jest.mock("features/Api/tenantsApi", () => ({
  useGetTenantByPropertyIdQuery: jest.fn(() => ({
    data: [],
  })),
}));

jest.mock("features/Api/rentApi", () => ({
  useGetUserDataByIdQuery: jest.fn(() => ({
    data: {},
    isLoading: false,
  })),

  useCreateRentRecordMutation: jest.fn(() => [
    jest.fn(),
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
            setShowSnackbar={jest.fn()}
            closeDialog={jest.fn()}
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
            setShowSnackbar={jest.fn()}
            closeDialog={jest.fn()}
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
