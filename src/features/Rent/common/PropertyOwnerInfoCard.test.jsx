import React from "react";

import PropertyOwnerInfoCard from "./PropertyOwnerInfoCard";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCreateRentRecord, mockUpdateUser } = vi.hoisted(() => ({
  mockCreateRentRecord: vi.fn(),
  mockUpdateUser: vi.fn(),
}));

vi.mock("common/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "tenant@test.com",
  }),
}));

vi.mock("features/Rent/utils", () => ({
  CashAppRentPaymentEnumValue: "CASH_APP",
  StripeRentPaymentEnumValue: "STRIPE",
  CompleteRentStatusEnumValue: "COMPLETE",
  PaidRentStatusEnumValue: "PAID",
  ManualRentStatusEnumValue: "MANUAL",
  RentIntentStatusEnumValue: "INTENT",
  formatCurrency: (value) => value,
  getNumberOfDaysPastDue: () => ({ count: 0 }),
}));

vi.mock("features/Rent/constants", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
  };
});

// RTK Query hooks
vi.mock("features/Api/firebaseUserApi", () => ({
  useUpdateUserByUidMutation: () => [mockUpdateUser, {}],
  useGetUserDataByIdQuery: () => ({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "owner@test.com",
      stripeAccountIsActive: true,
      cashAppTag: "owner-tag",
    },
    isLoading: false,
  }),
}));

vi.mock("features/Api/tenantsApi", () => ({
  useGetTenantByPropertyIdQuery: () => ({
    data: [],
  }),
}));

vi.mock("features/Api/rentApi", () => ({
  useCreateRentRecordMutation: () => [mockCreateRentRecord, { isError: false }],
  useLazyGetRentByMonthQuery: () => [vi.fn(), { data: [] }],
}));

vi.mock("features/Api/maintenanceApi", () => ({
  useLazyGetMaintenanceRecordsQuery: () => [
    vi.fn(),
    { data: [], isFetching: false },
  ],
}));

vi.mock("features/Api/externalIntegrationsApi", () => ({
  useCheckStripeAccountStatusQuery: () => ({
    data: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
  }),
}));

vi.mock("features/Rent/hooks/useGenerateStripeCheckoutSession", () => ({
  useGenerateStripeCheckoutSession: () => ({
    generateStripeCheckoutSession: vi.fn(),
  }),
}));

vi.mock("features/Rent/hooks/useCalculateMaintenanceDetails", () => ({
  useCalculateMaintenanceDetails: () => ({
    isRecentRecord: false,
  }),
}));

vi.mock("features/Rent/components/Settings/common", () => ({
  getStripeFailureReasons: () => [],
}));

// Payment components
vi.mock("features/Rent/common/PayRentButtonGroup", () => ({
  default: ({ handleCashAppClick, handleStripeClick }) => (
    <>
      <button onClick={handleCashAppClick}>Pay with Cash App</button>
      <button onClick={handleStripeClick}>Pay with Card</button>
    </>
  ),
}));

vi.mock("common/ConfirmationBox", () => ({
  default: ({ isOpen, title, handleConfirm, handleCancel }) =>
    isOpen ? (
      <div>
        <h2>{title}</h2>
        <button onClick={handleConfirm}>Confirm payment</button>
        <button onClick={handleCancel}>Cancel payment</button>
      </div>
    ) : null,
  DefaultConfirmationBoxProps: {
    value: false,
    updateKey: "",
    details: {},
  },
}));

const mockProperty = {
  id: "property-1",
  createdBy: "owner-1",
  rent: 1200,
  additionalRent: 0,
};

describe("PropertyOwnerInfoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreateRentRecord.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    mockUpdateUser.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });
  });

  it("renders the property owner information", () => {
    render(
      <PropertyOwnerInfoCard property={mockProperty} isViewingRental={false} />,
    );

    expect(screen.getByText("Property Owner")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("owner@test.com")).toBeInTheDocument();
  });

  it("renders payment options when viewing a rental", () => {
    render(<PropertyOwnerInfoCard property={mockProperty} isViewingRental />);

    expect(
      screen.getByRole("button", { name: /pay with cash app/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /pay with card/i }),
    ).toBeInTheDocument();
  });

  it("creates a Cash App payment intent after confirmation", async () => {
    const openWindowSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    render(<PropertyOwnerInfoCard property={mockProperty} isViewingRental />);

    fireEvent.click(screen.getByRole("button", { name: /pay with cash app/i }));

    expect(screen.getByText("Confirm rent payment")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /confirm payment/i }));

    await waitFor(() => {
      expect(mockCreateRentRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: "CASH_APP",
          status: "INTENT",
          propertyId: "property-1",
          propertyOwnerId: "owner-1",
          tenantId: "user-1",
          tenantEmail: "tenant@test.com",
        }),
      );
    });

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        uid: "user-1",
        newData: {
          preferredMethodOfRentPayment: "CASH_APP",
        },
      });
    });

    await waitFor(() => {
      expect(openWindowSpy).toHaveBeenCalledWith(
        expect.stringContaining("owner-tag"),
        "_blank",
        "noopener,noreferrer",
      );
    });

    openWindowSpy.mockRestore();
  });
});
