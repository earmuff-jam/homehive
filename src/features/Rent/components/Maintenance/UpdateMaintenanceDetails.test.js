import React from "react";

import UpdateMaintenanceDetails from "./UpdateMaintenanceDetails";
import { render, screen } from "@testing-library/react";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useViewMaintenanceImagesQuery } from "features/Api/firebaseStorageApi";
import {
  useGetMaintenanceRecordQuery,
  useUpdateMaintenanceDataMutation,
} from "features/Api/maintenanceApi";

jest.mock("features/Api/maintenanceApi");
jest.mock("features/Api/firebaseStorageApi");
jest.mock("features/Api/externalIntegrationsApi");

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "owner@test.com",
  }),
  isSelectedFeatureEnabled: jest.fn(() => true),
}));

jest.mock("features/Rent/utils", () => ({
  appendDisclaimer: jest.fn((v) => v),
  emailMessageBuilder: jest.fn(() => "message"),
  formatAndSendNotification: jest.fn(),
  UpdateMaintenanceRecordEnumValue: "Maintenance Updated",
}));

const sendEmail = jest.fn();
const updateMutation = jest.fn();

const defaultProps = {
  id: "maintenance-1",
  property: {
    id: "property-1",
    name: "My Property",
  },
  closeDialog: jest.fn(),
  isComplete: false,
  isPropertyOwner: true,
  primaryTenantEmail: "tenant@test.com",
};

describe("UpdateMaintenanceDetails", () => {
  describe("UpdateMaintenanceDetails snapshot tests", () => {
    beforeEach(() => {
      useSendEmailMutation.mockReturnValue([sendEmail]);

      useUpdateMaintenanceDataMutation.mockReturnValue([
        updateMutation,
        { isFetching: false, isSuccess: false },
      ]);

      useGetMaintenanceRecordQuery.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        data: {
          tenantFirstName: "John",
          tenantLastName: "Doe",
          tenantEmailAddress: "john@test.com",
          maintenanceCategory: "Electrical",
          description: "Light broken",
          status: "Pending",
          cost: 0,
          paymentMethod: "",
          note: "Waiting",
        },
      });
      useViewMaintenanceImagesQuery.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        data: [],
      });
    });
    it("matches snapshot", () => {
      const { container } = render(
        <UpdateMaintenanceDetails {...defaultProps} />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("UpdateMaintenanceDetails component tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      useSendEmailMutation.mockReturnValue([sendEmail]);
      useUpdateMaintenanceDataMutation.mockReturnValue([
        updateMutation,
        {
          isFetching: false,
          isSuccess: false,
        },
      ]);

      useGetMaintenanceRecordQuery.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        data: {
          tenantFirstName: "John",
          tenantLastName: "Doe",
          tenantEmailAddress: "john@test.com",
          maintenanceCategory: "Electrical",
          description: "Light broken",
          status: "Pending",
          cost: 0,
          paymentMethod: "",
          note: "Waiting",
        },
      });

      useViewMaintenanceImagesQuery.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        data: [],
      });
    });
    it("renders existing maintenance record", async () => {
      render(<UpdateMaintenanceDetails {...defaultProps} />);

      expect(await screen.findByDisplayValue("John")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Light broken")).toBeInTheDocument();
    });

    it("disables update button when maintenance is complete", () => {
      const props = {
        id: "maintenance-1",
        property: {
          id: "property-1",
          name: "My Property",
        },
        closeDialog: jest.fn(),
        isComplete: true,
        isPropertyOwner: true,
        primaryTenantEmail: "tenant@test.com",
      };

      render(<UpdateMaintenanceDetails {...props} />);

      expect(
        screen.getByRole("button", {
          name: /update maintenance request/i,
        }),
      ).toBeDisabled();
    });

    it("renders attached images section", () => {
      useViewMaintenanceImagesQuery.mockReturnValue({
        isLoading: false,
        isSuccess: true,
        data: [
          {
            downloadURL: "image.jpg",
          },
        ],
      });

      render(<UpdateMaintenanceDetails {...defaultProps} />);
      expect(screen.getByText(/attached images/i)).toBeInTheDocument();
    });
  });
});
