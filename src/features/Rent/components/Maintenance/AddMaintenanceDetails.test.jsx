import React from "react";

import AddMaintenanceDetails from "./AddMaintenanceDetails";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("common/utils", () => ({
  __esModule: true,
  fetchLoggedInUser: vi.fn(() => ({
    uid: "user-1",
    email: "owner@test.com",
  })),
  isSelectedFeatureEnabled: vi.fn(() => true),
}));

vi.mock("features/Api/externalIntegrationsApi", () => ({
  __esModule: true,
  useSendEmailMutation: () => [vi.fn()],
}));

vi.mock("features/Api/firebaseStorageApi", () => ({
  __esModule: true,
  useUploadMultipleImagesMutation: () => [vi.fn()],
}));

vi.mock("features/Api/firebaseUserApi", () => ({
  __esModule: true,
  useGetUserByEmailAddressQuery: () => ({
    data: {
      firstName: "John",
      lastName: "Doe",
    },
    isLoading: false,
  }),
}));

const mockCreateMaintenanceRecord = vi.fn();

vi.mock("features/Api/maintenanceApi", () => ({
  __esModule: true,
  useCreateMaintenanceRecordMutation: () => [
    mockCreateMaintenanceRecord,
    {
      originalArgs: {},
      isLoading: false,
      isSuccess: false,
    },
  ],
}));

vi.mock("features/Api/tenantsApi", () => ({
  __esModule: true,
  useGetTenantByPropertyIdQuery: () => ({
    data: [
      {
        id: "tenant-1",
        email: "tenant@test.com",
        isPrimary: true,
      },
    ],
  }),
}));

vi.mock("features/Rent/components/Image/MultipleImagePicker", () => ({
  __esModule: true,
  default: () => <div data-testid="multiple-image-picker" />,
}));

vi.mock("features/Rent/utils", () => ({
  __esModule: true,
  AddMaintenanceRecordEnumValue: "Maintenance request added",
  appendDisclaimer: vi.fn((msg) => msg),
  emailMessageBuilder: vi.fn(() => "email body"),
  formatAndSendNotification: vi.fn(),
}));

const property = {
  id: "prop-1",
  name: "Sunset Villa",
  createdBy: "owner-1",
};

const setShowSnackbar = vi.fn();
const closeDialog = vi.fn();

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
      vi.clearAllMocks();
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
        target: {
          value: "Jane",
        },
      });

      fireEvent.input(screen.getByPlaceholderText("Last Name"), {
        target: {
          value: "Smith",
        },
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
        target: {
          value: "Jane",
        },
      });

      fireEvent.input(screen.getByPlaceholderText("Last Name"), {
        target: {
          value: "Smith",
        },
      });

      const submitButton = screen.getByText(/Create maintenance request/i);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

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
