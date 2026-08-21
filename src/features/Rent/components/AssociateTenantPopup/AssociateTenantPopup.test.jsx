import React from "react";

import AssociateTenantPopup from "./AssociateTenantPopup";
import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("uuid", () => ({
  v4: () => "test-uuid",
}));

vi.mock("common/utils", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    fetchLoggedInUser: () => ({
      uid: "user-1",
      email: "user@test.com",
    }),
  };
});

vi.mock("features/Api/externalIntegrationsApi", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useSendEmailMutation: () => [vi.fn()],
  };
});

vi.mock("features/Api/tenantsApi", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAssociateTenantMutation: () => [
      vi.fn(),
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
  };
});

vi.mock("features/Api/firebaseUserApi", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useGetUserByEmailAddressQuery: () => ({
      data: {
        firstName: "John",
        lastName: "Doe",
      },
      isLoading: false,
    }),
  };
});

vi.mock("features/Rent/utils", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    appendDisclaimer: (m) => m,
    emailMessageBuilder: () => "email-body",
    formatAndSendNotification: vi.fn(),
    isAssociatedPropertySoR: () => true,
  };
});

vi.mock(
  "features/Rent/components/AssociateTenantPopup/TenantEmailAutocomplete",
  () => ({
    default: () => <div data-testid="tenant-email-autocomplete" />,
  }),
);

vi.mock("common/TextFieldWithLabel", () => ({
  __esModule: true,
  default: ({ label }) => <div>{label}</div>,
}));

describe("AssociateTenantPopup", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-12T12:00:00.000Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const props = {
    closeDialog: vi.fn(),
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
    refetchGetProperty: vi.fn(),
  };

  describe("Snapshot tests", () => {
    it("matches snapshot", () => {
      const { container } = render(<AssociateTenantPopup {...props} />);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe("Component tests", () => {
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

      expect(
        screen.getByRole("button", { name: "Associate" }),
      ).toBeInTheDocument();
    });
  });
});
