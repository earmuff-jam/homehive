import React from "react";

import PropertyOwnerInfoCard from "./PropertyOwnerInfoCard";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "tenant@test.com",
  }),
  formatCurrency: (v) => v,
}));

// RTK Query hooks
vi.mock("features/Api/firebaseUserApi", () => ({
  useGetUserDataByIdQuery: () => ({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "owner@test.com",
      stripeAccountIsActive: true,
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
  useCreateRentRecordMutation: () => [vi.fn(), {}],
  useLazyGetRentByMonthQuery: () => [vi.fn(), { data: [] }],
}));

vi.mock("features/Api/maintenanceApi", () => ({
  useLazyGetMaintenanceRecordsQuery: () => [vi.fn(), { data: [] }],
}));

vi.mock("features/Api/externalIntegrationsApi", () => ({
  useCheckStripeAccountStatusQuery: () => ({
    data: [],
    loading: false,
  }),
}));

// Stripe hooks
vi.mock("features/Rent/hooks/useGenerateStripeCheckoutSession", () => ({
  useGenerateStripeCheckoutSession: () => ({
    generateStripeCheckoutSession: vi.fn(),
  }),
}));

// Misc components
vi.mock("features/Rent/components/Settings/common", () => ({
  getStripeFailureReasons: () => [],
}));

const mockProperty = {
  id: "property-1",
  createdBy: "owner-1",
  rent: 1200,
  additionalRent: 0,
};

describe("PropertyOwnerInfoCard Jest Tests", () => {
  describe("PropertyOwnerInfoCard Snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <PropertyOwnerInfoCard
          property={mockProperty}
          isViewingRental={false}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("PropertyOwnerInfoCard Component tests", () => {
    it("renders without crashing", () => {
      render(
        <PropertyOwnerInfoCard
          property={mockProperty}
          isViewingRental={false}
        />,
      );

      expect(screen.getByText("Property Owner")).toBeInTheDocument();
    });

    it("shows Pay Rent button when viewing rental", () => {
      render(<PropertyOwnerInfoCard property={mockProperty} isViewingRental />);

      expect(
        screen.getByRole("button", { name: /pay rent/i }),
      ).toBeInTheDocument();
    });
  });
});
