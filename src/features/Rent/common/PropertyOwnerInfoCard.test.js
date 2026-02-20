import React from "react";

import PropertyOwnerInfoCard from "./PropertyOwnerInfoCard";
import { render, screen } from "@testing-library/react";

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));

jest.mock("features/Rent/utils", () => ({
  fetchLoggedInUser: () => ({
    uid: "user-1",
    email: "tenant@test.com",
  }),
  formatCurrency: (v) => v,
}));

// RTK Query hooks
jest.mock("features/Api/firebaseUserApi", () => ({
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

jest.mock("features/Api/tenantsApi", () => ({
  useGetTenantByPropertyIdQuery: () => ({
    data: [],
  }),
}));

jest.mock("features/Api/rentApi", () => ({
  useCreateRentRecordMutation: () => [jest.fn(), {}],
  useLazyGetRentByMonthQuery: () => [jest.fn(), { data: [] }],
}));

// Stripe hooks
jest.mock("features/Rent/hooks/useCheckStripeAccountStatus", () => ({
  useCheckStripeAccountStatus: () => ({
    checkStatus: jest.fn(),
    loading: false,
  }),
}));

jest.mock("features/Rent/hooks/useGenerateStripeCheckoutSession", () => ({
  useGenerateStripeCheckoutSession: () => ({
    generateStripeCheckoutSession: jest.fn(),
  }),
}));

// Misc components
jest.mock("common/CustomSnackbar", () => () => null);
jest.mock("features/Rent/components/Settings/common", () => ({
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
