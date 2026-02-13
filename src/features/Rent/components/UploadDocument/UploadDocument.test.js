import React from "react";

import UploadDocument from "./UploadDocument";
import { render } from "@testing-library/react";

jest.mock("common/AButton", () => (props) => (
  <button data-testid="select-file-btn" onClick={props.onClick}>
    {props.label}
  </button>
));

jest.mock("common/CustomSnackbar", () => () => <div data-testid="snackbar" />);

jest.mock("features/Rent/components/UploadDocument/FileDetails", () => () => (
  <div data-testid="file-details" />
));

jest.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({ uid: "test-user" }),
}));

describe("UploadDocument Snapshot Tests", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <UploadDocument
        selectedFile={null}
        setSelectedFile={jest.fn()}
        getWorkspaces={jest.fn()}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
