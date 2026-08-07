// RentCollectionAccordion.test.jsx
import React from "react";

import RentCollectionAccordion from "./RentCollectionAccordion";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock(
  "features/Rent/components/MyReports/StatsAccordionDetailsBlock",
  () => ({
    default: ({ label, value }) => (
      <div>
        {label}: {value}
      </div>
    ),
  }),
);

vi.mock("features/Rent/hooks/useCalculatePropertyStatistics", () => ({
  useCalculatePropertyStatistics: vi.fn(() => ({
    primaryTenant: {
      term: "12 Months",
    },
    averageLateRentPayment: 3.8,
    averageOnTimeRentPayment: 0.92,
    outstandingBalance: 1450,
  })),
}));

describe("RentCollectionAccordion", () => {
  it("renders rent collection statistics", () => {
    render(
      <RentCollectionAccordion
        label="Rent Collection"
        selected={{}}
        properties={[]}
        existingRents={[]}
        existingTenants={[]}
        dataTour="rent-collection"
      />,
    );

    expect(screen.getByText("Rent Collection")).toBeInTheDocument();

    expect(screen.getByText(/On time rent/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg. days late/i)).toBeInTheDocument();
    expect(screen.getByText(/Outstanding balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Cost \/ Rent Ratio/i)).toBeInTheDocument();
  });
});
