import React from "react";

import AddMaintenanceDetails from "./AddMaintenanceDetails";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("common/utils", () => ({
  fetchLoggedInUser: jest.fn(() => ({
    uid: "user-1",
    email: "owner@test.com",
  })),
}));

jest.mock("common/AIconButton", () => ({
  __esModule: true,
  default: (props) => <button {...props} />,
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
  useSendEmailMutation: () => [jest.fn()],
}));

jest.mock("features/Api/firebaseStorageApi", () => ({
  useUploadMultipleImagesMutation: () => [jest.fn()],
}));

jest.mock("features/Api/firebaseUserApi", () => ({
  useGetUserByEmailAddressQuery: () => ({
    data: { firstName: "John", lastName: "Doe" },
    isLoading: false,
  }),
}));

const mockCreateMaintenanceRecord = jest.fn();
jest.mock("features/Api/maintenanceApi", () => ({
  useCreateMaintenanceRecordMutation: () => [
    mockCreateMaintenanceRecord,
    { originalArgs: {}, isLoading: false, isSuccess: false },
  ],
}));

jest.mock("features/Api/tenantsApi", () => ({
  useGetTenantByPropertyIdQuery: () => ({
    data: [{ id: "tenant-1", email: "tenant@test.com", isPrimary: true }],
  }),
}));

jest.mock(
  "features/Rent/components/Image/MultipleImagePicker",
  () => (props) => <div data-testid="multiple-image-picker" />,
);

jest.mock("features/Rent/utils", () => ({
  AddMaintenanceRecordEnumValue: "Maintenance request added",
  appendDisclaimer: jest.fn((msg) => msg),
  emailMessageBuilder: jest.fn(() => "email body"),
  formatAndSendNotification: jest.fn(),
  isFeatureEnabled: jest.fn(() => true),
}));

const property = {
  id: "prop-1",
  name: "Sunset Villa",
  createdBy: "owner-1",
};
const setShowSnackbar = jest.fn();
const closeDialog = jest.fn();

describe("AddMaintenanceDetails tests", () => {
  describe("AddMaintenanceDetails snapshot tests", () => {
    const defaultProps = {
      property,
      setShowSnackbar,
      closeDialog,
    };
    it("matches snapshot", () => {
      const { container } = render(<AddMaintenanceDetails {...defaultProps} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("AddMaintenanceDetails component tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("renders the tenant and maintenance request fields", () => {
      render(
        <AddMaintenanceDetails
          property={property}
          setShowSnackbar={setShowSnackbar}
          closeDialog={closeDialog}
        />,
      );

      expect(screen.getByText(/Tenant Information/i)).toBeInTheDocument();
      expect(screen.getByText(/^Maintenance Request$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
      expect(screen.getByTestId("multiple-image-picker")).toBeInTheDocument();
    });

    it("disables the submit button until required fields are filled", async () => {
      render(
        <AddMaintenanceDetails
          property={property}
          setShowSnackbar={setShowSnackbar}
          closeDialog={closeDialog}
        />,
      );

      const submitButton = screen.getByText(/Create maintenance request/i);
      expect(submitButton).toBeDisabled();

      fireEvent.input(screen.getByPlaceholderText("First Name"), {
        target: { value: "Jane" },
      });
      fireEvent.input(screen.getByPlaceholderText("Last Name"), {
        target: { value: "Smith" },
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("calls createMaintenanceRecord with expected payload on submit", async () => {
      render(
        <AddMaintenanceDetails
          property={property}
          setShowSnackbar={setShowSnackbar}
          closeDialog={closeDialog}
        />,
      );

      fireEvent.input(screen.getByPlaceholderText("First Name"), {
        target: { value: "Jane" },
      });
      fireEvent.input(screen.getByPlaceholderText("Last Name"), {
        target: { value: "Smith" },
      });

      const submitButton = screen.getByText(/Create maintenance request/i);
      await waitFor(() => expect(submitButton).not.toBeDisabled());

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateMaintenanceRecord).toHaveBeenCalledWith(
          expect.objectContaining({
            propertyId: "prop-1",
            propertyOwnerId: "owner-1",
            tenantId: "tenant-1",
          }),
        );
      });
    });
  });
});
