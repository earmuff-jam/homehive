import React from "react";

import UploadDocument from "./UploadDocument";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/components/UploadDocument/FileDetails", () => ({
  __esModule: true,
  default: () => <div data-testid="file-details" />,
}));

vi.mock("common/utils", () => ({
  __esModule: true,
  fetchLoggedInUser: () => ({
    uid: "test-user",
  }),
}));

describe("UploadDocument Snapshot Tests", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <UploadDocument
        selectedFile={null}
        setSelectedFile={vi.fn()}
        getWorkspaces={vi.fn()}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
