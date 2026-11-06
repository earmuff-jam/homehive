import React from "react";

import AddMaintenanceDetails from "./AddMaintenanceDetails";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockCreateMaintenanceRecord,
  mockGetMaintenanceRecords,
  mockUpdateUser,
} = vi.hoisted(() => ({
  mockCreateMaintenanceRecord: vi.fn(),
  mockGetMaintenanceRecords: vi.fn(),
  mockUpdateUser: vi.fn(),
}));

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
      firstName: "Jane",
      lastName: "Smith",
      email: "tenant@test.com",
    },
    isLoading: false,
    isSuccess: true,
  }),
  useLazyGetBadgeValidationByBadgeKeysQuery: () => [
    vi.fn(),
    {
      data: false,
      isLoading: false,
      isSuccess: false,
      originalArgs: undefined,
    },
  ],
  useUpdateUserByUidMutation: () => [mockUpdateUser],
}));

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
  useGetMaintenanceRecordsQuery: mockGetMaintenanceRecords,
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
  const defaultProps = {
    property,
    setShowSnackbar,
    closeDialog,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockCreateMaintenanceRecord.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    mockGetMaintenanceRecords.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });
  });

  describe("snapshot tests", () => {
    it("matches snapshot", () => {
      const { container } = render(<AddMaintenanceDetails {...defaultProps} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("component tests", () => {
    it("renders the tenant and maintenance request fields", () => {
      render(<AddMaintenanceDetails {...defaultProps} />);

      expect(screen.getByText(/Tenant Information/i)).toBeInTheDocument();
      expect(screen.getByText(/^Maintenance Request$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
      expect(screen.getByTestId("multiple-image-picker")).toBeInTheDocument();
    });

    it("disables the submit button until required fields are filled", async () => {
      render(<AddMaintenanceDetails {...defaultProps} />);

      const submitButton = screen.getByText(/Create maintenance request/i);

      expect(submitButton).toBeDisabled();

      fireEvent.mouseDown(
        screen.getByRole("combobox", {
          name: "Maintenance Type *",
        }),
      );

      fireEvent.click(
        screen.getByRole("option", {
          name: "Plumbing",
        }),
      );

      fireEvent.change(screen.getByLabelText("Description *"), {
        target: {
          value:
            "This is a sample maintenance description that exceeds fifty characters.",
        },
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it("calls createMaintenanceRecord with expected payload on submit", async () => {
      render(<AddMaintenanceDetails {...defaultProps} />);

      const submitButton = screen.getByText(/Create maintenance request/i);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("First Name")).toHaveValue("Jane");
        expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Smith");
      });

      fireEvent.mouseDown(
        screen.getByRole("combobox", {
          name: "Maintenance Type *",
        }),
      );

      fireEvent.click(
        screen.getByRole("option", {
          name: "Plumbing",
        }),
      );

      fireEvent.change(screen.getByLabelText("Description *"), {
        target: {
          value:
            "This is a sample maintenance description that exceeds fifty characters.",
        },
      });

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
            tenantEmail: "tenant@test.com",
            tenantFirstName: "Jane",
            tenantLastName: "Smith",
            maintenanceCategory: "Plumbing",
            description:
              "This is a sample maintenance description that exceeds fifty characters.",
            status: "Created",
            createdBy: "user-1",
          }),
        );
      });
    });
  });
});
