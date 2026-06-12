import React from "react";

import MyRental from "./MyRental";
import { render, screen } from "@testing-library/react";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetRentsByPropertyIdQuery } from "features/Api/rentApi";
import {
  useGetActiveTenantsByEmailAddressQuery,
  useGetTenantByPropertyIdQuery,
} from "features/Api/tenantsApi";

jest.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({ email: "test@test.com" }),
}));

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ search: "" }),
  useNavigate: () => jest.fn(),
}));

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("hooks/useAppTitle", () => ({
  useAppTitle: () => {},
}));

jest.mock("features/Api/tenantsApi", () => ({
  useGetActiveTenantsByEmailAddressQuery: jest.fn(),
  useGetTenantByPropertyIdQuery: jest.fn(),
}));

jest.mock("features/Api/propertiesApi", () => ({
  useGetPropertiesByPropertyIdQuery: jest.fn(),
}));

jest.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: jest.fn(),
}));

jest.mock("features/Api/rentApi", () => ({
  useGetRentsByPropertyIdQuery: jest.fn(),
}));

jest.mock("features/Rent/common/PropertyHeader", () => () => (
  <div data-testid="property-header" />
));
jest.mock("features/Rent/common/PropertyStatistics", () => () => (
  <div data-testid="property-stats" />
));
jest.mock("features/Rent/components/Widgets/FinancialOverview", () => () => (
  <div data-testid="financial-overview" />
));
jest.mock(
  "features/Rent/components/Widgets/RentalPaymentOverview",
  () => () => <div data-testid="payment-overview" />,
);
jest.mock("features/Rent/common/PropertyOwnerInfoCard", () => () => (
  <div data-testid="owner-card" />
));
jest.mock("features/Rent/common/PropertyDetails", () => () => (
  <div data-testid="property-details" />
));

const resetMocks = () => {
  useGetActiveTenantsByEmailAddressQuery.mockReset();
  useGetTenantByPropertyIdQuery.mockReset();
  useGetPropertiesByPropertyIdQuery.mockReset();
  useGetUserDataByIdQuery.mockReset();
  useGetRentsByPropertyIdQuery.mockReset();
};

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
      data: { propertyId: "123", isPrimary: true },
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
      data: [{ isSoR: false }],
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

    const { container } = render(<MyRental />);

    expect(container).toMatchSnapshot();
  });
});
