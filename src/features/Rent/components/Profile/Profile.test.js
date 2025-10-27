import React from "react";

import { Provider } from "react-redux";

import { Profile } from "./Profile";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";

jest.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: jest.fn(() => ({
    data: {
      uid: "123",
      googleDisplayName: "John Doe",
      googleEmailAddress: "john@example.com",
      googlePhotoURL: "",
      googleLastLoginAt: new Date().toISOString(),
    },
    isLoading: false,
  })),
  useUpdateUserByUidMutation: jest.fn(() => [jest.fn(), {}]),
}));

jest.mock("features/Rent/utils/utils", () => ({
  fetchLoggedInUser: jest.fn(() => ({
    uid: "123",
    role: "Owner",
  })),
}));

jest.mock("common/TextFieldWithLabel", () => (props) => (
  <input data-testid={props.id} {...props} />
));
jest.mock("common/AButton", () => (props) => (
  <button data-testid="save-button">{props.label}</button>
));
jest.mock("common/CustomSnackbar/CustomSnackbar", () => () => (
  <div data-testid="snackbar" />
));
jest.mock("common/RowHeader/RowHeader", () => (props) => (
  <div data-testid="row-header">{props.title}</div>
));

const store = configureStore({
  reducer: (state = {}) => state,
});

describe("<Profile />", () => {
  it("should render and test snapshots", () => {
    const { asFragment } = render(<Profile />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("should render without crashing and shows main sections", () => {
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByTestId("row-header")).toBeInTheDocument();
    expect(screen.getByTestId("save-button")).toBeInTheDocument();
  });
});
