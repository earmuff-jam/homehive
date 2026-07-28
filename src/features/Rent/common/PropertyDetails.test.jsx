import React from "react";

import PropertyDetails from "./PropertyDetails";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock map amenities API
vi.mock("features/Api/mapAmenitiesApi", () => ({
  useGetNearbyAmenitiesQuery: () => ({
    data: {},
    isLoading: false,
  }),
}));

// Mock properties API
vi.mock("features/Api/propertiesApi", () => ({
  useFetchAdditionalAmenitiesQuery: () => ({
    data: {},
    isLoading: false,
  }),
  useSaveAmenitiesForPropertyMutation: () => [vi.fn(), {}],
}));

vi.mock("features/Rent/components/PropertyMap/PropertyMap", () => ({
  default: () => <div data-testid="property-map" />,
}));

vi.mock("common/RowHeader", () => ({
  default: ({ title, caption }) => (
    <div data-testid="row-header">
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

describe("PropertyDetails tests", () => {
  const mockProperty = {
    units: 3,
    bathrooms: 2,
    createdOn: "2025-12-14T00:00:00Z",
    updatedOn: "2025-12-14T06:08:21.938Z",
    location: { lat: 0, lng: 0 },
  };

  it("renders loading skeleton when property is loading", () => {
    const { container } = render(
      <PropertyDetails isPropertyLoading={true} property={null} />,
    );

    expect(screen.getByTestId("property-map")).toBeInTheDocument();
    expect(screen.getByTestId("row-header")).toBeInTheDocument();
    expect(screen.getByText("Property Details")).toBeInTheDocument();
    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
  });

  it("renders property details when loading is false", () => {
    render(
      <PropertyDetails isPropertyLoading={false} property={mockProperty} />,
    );

    expect(screen.getByTestId("property-map")).toBeInTheDocument();
    expect(screen.getByText("Property Details")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Bedrooms")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Bathrooms")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();
  });
});
