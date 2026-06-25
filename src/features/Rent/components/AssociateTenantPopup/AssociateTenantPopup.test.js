import React from "react";

import AssociateTenantPopup from "./AssociateTenantPopup";
import { render, screen } from "@testing-library/react";

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

jest.mock("features/Api/tenantsApi", () => ({
  useAssociateTenantMutation: () => [
    jest.fn(),
    { isSuccess: false, isLoading: false, originalArgs: null },
  ],
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
  AddNotificationEnumType: "AddNotification",
  AddTenantNotificationEnumValue: "Tenant Added",
  appendDisclaimer: (m) => m,
  emailMessageBuilder: () => "email-body",
  formatAndSendNotification: jest.fn(),
  isAssociatedPropertySoR: () => true,
}));

jest.mock(
  "features/Rent/components/AssociateTenantPopup/TenantEmailAutocomplete",
  () => () => <div data-testid="tenant-email-autocomplete" />,
);

jest.mock("common/TextFieldWithLabel", () => ({
  __esModule: true,
  default: ({ label }) => <div>{label}</div>,
}));

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

describe("AssociateTenantPopup test", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-12T12:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("AssociateTenantPopup", () => {
    const props = {
      closeDialog: jest.fn(),
      property: {
        id: "p1",
        name: "Test Property",
        createdBy: "owner-1",
      },
      tenants: [
        {
          id: "t1",
          email: "tenant@test.com",
          isPrimary: true,
        },
      ],
      refetchGetProperty: jest.fn(),
    };

    it("matches snapshot", () => {
      const { container } = render(<AssociateTenantPopup {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("AssociateTenantPopup behavior", () => {
    const props = {
      closeDialog: jest.fn(),
      property: {
        id: "p1",
        name: "Test Property",
        createdBy: "owner-1",
      },
      tenants: [
        {
          id: "t1",
          email: "tenant@test.com",
          isPrimary: true,
        },
      ],
      refetchGetProperty: jest.fn(),
    };

    it("renders main sections", () => {
      render(<AssociateTenantPopup {...props} />);

      expect(screen.getByText("Lease Information")).toBeInTheDocument();
      expect(screen.getByText("Charges and Fees")).toBeInTheDocument();
      expect(screen.getByText("Tenant Information")).toBeInTheDocument();
    });

    it("renders tenant autocomplete", () => {
      render(<AssociateTenantPopup {...props} />);

      expect(
        screen.getByTestId("tenant-email-autocomplete"),
      ).toBeInTheDocument();
    });

    it("renders associate button", () => {
      render(<AssociateTenantPopup {...props} />);

      expect(screen.getByText("Associate")).toBeInTheDocument();
    });
  });
});
