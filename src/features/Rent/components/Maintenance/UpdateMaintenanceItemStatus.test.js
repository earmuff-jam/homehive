import React from "react";

import UpdateMaintenanceItemStatus from "./UpdateMaintenanceItemStatus";
import { render, screen } from "@testing-library/react";

jest.mock("common/utils", () => ({
  fetchLoggedInUser: jest.fn(() => ({
    uid: "user-1",
    email: "user@test.com",
  })),
}));

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("features/Api/externalIntegrationsApi", () => ({
  useSendEmailMutation: jest.fn(() => [jest.fn()]),
}));

jest.mock("features/Api/maintenanceApi", () => ({
  useUpdateMaintenanceDataMutation: jest.fn(() => [
    jest.fn(),
    {
      isFetching: false,
      isSuccess: false,
    },
  ]),
}));

describe("View maintenance record tests", () => {
  describe("UpdateMaintenanceItemStatus", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <UpdateMaintenanceItemStatus
          id="maintenance-1"
          status="Completed"
          closeDialog={jest.fn()}
          propertyName="Test Property"
          primaryTenantEmail="tenant@test.com"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("UpdateMaintenanceItemStatus behavior", () => {
    const defaultProps = {
      id: "maintenance-1",
      status: "Completed",
      closeDialog: jest.fn(),
      propertyName: "Test Property",
      primaryTenantEmail: "tenant@test.com",
    };

    it("renders note field", () => {
      render(<UpdateMaintenanceItemStatus {...defaultProps} />);

      expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
    });

    it("renders update button", () => {
      render(<UpdateMaintenanceItemStatus {...defaultProps} />);

      expect(
        screen.getByRole("button", {
          name: /update maintenance request/i,
        }),
      ).toBeInTheDocument();
    });
  });
});
