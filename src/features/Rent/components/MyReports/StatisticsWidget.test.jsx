// StatisticsWidget.test.jsx
import React from "react";

import StatisticsWidget from "./StatisticsWidget";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/components/MyReports/PropertyMenuItemSelector", () => ({
  default: () => <div>Property Selector</div>,
}));

vi.mock("features/Rent/components/MyReports/PropertyStatistics", () => ({
  default: () => <div>Property Statistics Component</div>,
}));

describe("StatisticsWidget", () => {
  it("renders the statistics widget", () => {
    render(
      <StatisticsWidget data={[]} existingTenants={[]} existingRents={[]} />,
    );

    expect(screen.getByText("Property statistics")).toBeInTheDocument();

    expect(
      screen.getByText("View statistics about your registered properties"),
    ).toBeInTheDocument();

    expect(screen.getByText("Property Selector")).toBeInTheDocument();

    expect(
      screen.getByText("Property Statistics Component"),
    ).toBeInTheDocument();
  });
});
