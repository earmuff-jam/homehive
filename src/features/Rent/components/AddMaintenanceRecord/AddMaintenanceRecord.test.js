import React from "react";

import AddMaintenanceRecord from "./AddMaintenanceRecord";
import { fireEvent, render, screen } from "@testing-library/react";

/* -------------------- mocks -------------------- */

jest.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

jest.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "user@test.com",
  }),
}));

jest.mock("features/Api/externalIntegrationsApi", () => ({
  useSendEmailMutation: () => [jest.fn()],
}));

jest.mock("features/Api/maintenanceApi", () => ({
  useCreateMaintenanceRecordMutation: () => [
    jest.fn(),
    { isLoading: false, isSuccess: false },
  ],
}));

jest.mock("features/Api/tenantsApi", () => ({
  useGetTenantByPropertyIdQuery: () => ({
    data: [
      {
        id: "t1",
        email: "tenant@test.com",
        isPrimary: true,
      },
    ],
  }),
}));

jest.mock("features/Api/firebaseUserApi", () => ({
  useGetUserByEmailAddressQuery: () => ({
    data: {
      firstName: "John",
      lastName: "Doe",
    },
    isLoading: false,
  }),
}));

jest.mock("features/Rent/utils", () => ({
  AddMaintenanceRecordEnumValue: "Create Maintenance",
  appendDisclaimer: (msg) => msg,
  emailMessageBuilder: () => "email-body",
  formatAndSendNotification: jest.fn(),
}));

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("common/TextFieldWithLabel", () => ({
  __esModule: true,
  default: ({ label }) => <div>{label}</div>,
}));

describe("Add Maintenance Record tests", () => {
  describe("AddMaintenanceRecord", () => {
    const props = {
      property: {
        id: "p1",
        name: "Test Property",
        createdBy: "owner-1",
      },
      setShowSnackbar: jest.fn(),
      closeDialog: jest.fn(),
    };

    it("matches snapshot", () => {
      const { container } = render(<AddMaintenanceRecord {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("AddMaintenanceRecord behavior", () => {
    const props = {
      property: {
        id: "p1",
        name: "Test Property",
        createdBy: "owner-1",
      },
      setShowSnackbar: jest.fn(),
      closeDialog: jest.fn(),
    };

    it("renders tenant and maintenance sections", () => {
      render(<AddMaintenanceRecord {...props} />);

      expect(screen.getByText("Tenant Information")).toBeInTheDocument();
      expect(screen.getByText("Maintenance Request")).toBeInTheDocument();
    });

    it("renders create button", () => {
      render(<AddMaintenanceRecord {...props} />);

      expect(
        screen.getByText("Create maintenance request"),
      ).toBeInTheDocument();
    });

    it("submits form via button click", () => {
      render(<AddMaintenanceRecord {...props} />);

      fireEvent.click(screen.getByText("Create maintenance request"));
    });
  });
});
