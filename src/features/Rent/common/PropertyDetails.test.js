import React from "react";

import PropertyDetails from "./PropertyDetails";
import { render, screen } from "@testing-library/react";

// Mock child components that are not part of this test
jest.mock("features/Rent/components/PropertyMap/PropertyMap", () => () => (
  <div data-testid="property-map" />
));

// no snapshot test as it conflicts with dayjs xx time from now
describe("PropertyDetails Jest Tests", () => {
  describe("PropertyDetails Components Test", () => {
    const mockProperty = {
      units: 3,
      bathrooms: 2,
      createdOn: "2025-12-14T00:00:00Z",
      updatedOn: "2025-12-14T06:08:21.938Z",
      location: { lat: 0, lng: 0 },
    };

    it("renders loading skeleton when property is loading", () => {
      render(<PropertyDetails isPropertyLoading={true} property={null} />);

      expect(screen.getByTestId("property-map")).toBeInTheDocument();
      expect(screen.getByText("Property Details")).toBeInTheDocument();
    });

    it("renders property details when loading is false", () => {
      render(
        <PropertyDetails isPropertyLoading={false} property={mockProperty} />,
      );

      expect(screen.getByText("Property Details")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Bedrooms")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Bathrooms")).toBeInTheDocument();
      expect(screen.getByText("Created")).toBeInTheDocument();
      expect(screen.getByText("Last Updated")).toBeInTheDocument();
    });
  });
});
