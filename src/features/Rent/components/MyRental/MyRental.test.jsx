import React from "react";

import MyRental from "./MyRental";
import { ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetRentsByPropertyIdQuery } from "features/Api/rentApi";
import {
  useGetActiveTenantsByEmailAddressQuery,
  useGetTenantByPropertyIdQuery,
} from "features/Api/tenantsApi";
import { lightTheme } from "src/Theme";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("common/utils", () => ({
  __esModule: true,
  fetchLoggedInUser: () => ({
    email: "test@test.com",
  }),
}));

vi.mock("react-router-dom", () => ({
  __esModule: true,
  useLocation: () => ({
    search: "",
  }),
  useNavigate: () => vi.fn(),
}));

vi.mock("hooks/useAppTitle", () => ({
  __esModule: true,
  useAppTitle: () => {},
}));

vi.mock("features/Api/tenantsApi", () => ({
  __esModule: true,
  useGetActiveTenantsByEmailAddressQuery: vi.fn(),
  useGetTenantByPropertyIdQuery: vi.fn(),
}));

vi.mock("features/Api/propertiesApi", () => ({
  __esModule: true,
  useGetPropertiesByPropertyIdQuery: vi.fn(),
}));

vi.mock("features/Api/firebaseUserApi", () => ({
  __esModule: true,
  useGetUserDataByIdQuery: vi.fn(),
}));

vi.mock("features/Api/rentApi", () => ({
  __esModule: true,
  useGetRentsByPropertyIdQuery: vi.fn(),
}));

vi.mock("features/Api/maintenanceApi", () => ({
  __esModule: true,
  useGetMaintenanceRecordsQuery: vi.fn(),
  useUpdateMaintenanceDataMutation: vi.fn(() => [
    vi.fn(),
    {
      isLoading: false,
    },
  ]),
}));

vi.mock("features/Api/externalIntegrationsApi", () => ({
  __esModule: true,
  useSendEmailMutation: () => [vi.fn()],
}));

vi.mock("features/Rent/utils", () => ({
  __esModule: true,
  AddMaintenanceRecordEnumValue: "Create Maintenance",
  appendDisclaimer: (msg) => msg,
  emailMessageBuilder: () => "email-body",
  formatAndSendNotification: vi.fn(),
}));

vi.mock("features/Rent/common/PropertyHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="property-header" />,
}));

vi.mock("features/Rent/common/PropertyStatistics", () => ({
  __esModule: true,
  default: () => <div data-testid="property-stats" />,
}));

vi.mock("features/Rent/components/Widgets/FinancialOverview", () => ({
  __esModule: true,
  default: () => <div data-testid="financial-overview" />,
}));

vi.mock("features/Rent/components/Widgets/RentalPaymentOverview", () => ({
  __esModule: true,
  default: () => <div data-testid="payment-overview" />,
}));

vi.mock("features/Rent/common/PropertyOwnerInfoCard", () => ({
  __esModule: true,
  default: () => <div data-testid="owner-card" />,
}));

vi.mock("features/Rent/common/PropertyDetails", () => ({
  __esModule: true,
  default: () => <div data-testid="property-details" />,
}));

const resetMocks = () => {
  useGetActiveTenantsByEmailAddressQuery.mockReset();
  useGetTenantByPropertyIdQuery.mockReset();
  useGetPropertiesByPropertyIdQuery.mockReset();
  useGetUserDataByIdQuery.mockReset();
  useGetRentsByPropertyIdQuery.mockReset();
  useGetMaintenanceRecordsQuery.mockReset();
};

const renderWithTheme = (item) =>
  render(<ThemeProvider theme={lightTheme}>{item}</ThemeProvider>);

describe("MyRental", () => {
  afterEach(() => resetMocks());

  it("shows empty state when no property", () => {
    useGetActiveTenantsByEmailAddressQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    useGetPropertiesByPropertyIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    useGetTenantByPropertyIdQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    useGetUserDataByIdQuery.mockReturnValue({
      data: {},
      isLoading: false,
    });

    useGetRentsByPropertyIdQuery.mockReturnValue({
      data: [{}],
      isLoading: false,
    });

    useGetMaintenanceRecordsQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<MyRental />);

    expect(
      screen.getByText(
        /No active properties have been assigned to you as a tenant/i,
      ),
    ).toBeInTheDocument();
  });

  it("matches snapshot (full loaded state)", () => {
    useGetActiveTenantsByEmailAddressQuery.mockReturnValue({
      data: {
        propertyId: "123",
        isPrimary: true,
      },
      isLoading: false,
    });

    useGetPropertiesByPropertyIdQuery.mockReturnValue({
      data: {
        id: "123",
        name: "Charles Zanco Home",
        createdBy: "owner-1",
      },
      isLoading: false,
    });

    useGetTenantByPropertyIdQuery.mockReturnValue({
      data: [
        {
          isSoR: false,
        },
      ],
      isLoading: false,
    });

    useGetUserDataByIdQuery.mockReturnValue({
      data: {
        email: "owner@test.com",
        stripeAccountId: "acct_123",
      },
      isLoading: false,
    });

    useGetRentsByPropertyIdQuery.mockReturnValue({
      data: [],
      isLoading: false,
    });

    useGetMaintenanceRecordsQuery.mockReturnValue({
      data: [
        {
          id: "test-id",
          updatedBy: "testUserId",
          description: "The fridge broke and does not work anymore.",
          tenantEmailAddress: "testUserEmail@gmail.com",
          propertyOwnerId: "ownerId",
          propertyId: "testPropertyId",
          firstName: "John",
          tenantLastName: "Doe",
          createdOn: "2026-06-10T21:18:30.853Z",
          tenantEmail: "testUserEmail@gmail.com",
          tenantId: "testTenantId",
          updatedOn: "2026-06-10T21:18:30.853Z",
          createdBy: "testUserId",
          maintenanceCategory: "Appliances",
        },
      ],
      isLoading: false,
    });

    const { container } = renderWithTheme(<MyRental />);

    expect(container).toMatchSnapshot();
  });
});
