// MaintenanceHealthAccordion.test.jsx
import React from "react";

import MaintenanceHealthAccordion from "./MaintenanceHealthAccordion";
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

vi.mock("features/Rent/hooks/useCalculateMaintenanceDetails", () => ({
  useCalculateMaintenanceDetails: vi.fn(() => ({
    openMaintenanceRecords: [{ id: 1 }],
    totalSpentCurrentYear: 1200,
    totalSpentPreviousYear: 900,
    averageResolutionTime: "5 days",
    latestUpdatedOn: "2025-01-01",
    costRentRatio: 0.15,
  })),
}));

describe("MaintenanceHealthAccordion", () => {
  it("renders maintenance statistics", () => {
    render(
      <MaintenanceHealthAccordion
        label="Maintenance Health"
        dataTour="maintenance-health"
        maintenanceRecords={[]}
        totalRentalIncomeForYr={10000}
        formattedMaintenanceCategoryOptions={[
          {
            id: 1,
            label: "Plumbing",
            value: 8,
          },
          {
            id: 2,
            label: "Electrical",
            value: 4,
          },
        ]}
      />,
    );

    expect(screen.getByText("Maintenance Health")).toBeInTheDocument();
    expect(screen.getByText(/Open requests/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg. Resolution time/i)).toBeInTheDocument();
    expect(screen.getByText(/Total spent YTD/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintenance \/ Rent Ratio/i)).toBeInTheDocument();

    expect(screen.getByText("Top Maintenance Issues")).toBeInTheDocument();
    expect(screen.getByText("Plumbing")).toBeInTheDocument();
    expect(screen.getByText("Electrical")).toBeInTheDocument();
  });
});
