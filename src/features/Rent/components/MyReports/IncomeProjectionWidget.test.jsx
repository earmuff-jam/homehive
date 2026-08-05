// IncomeProjectionWidget.test.jsx
import React from "react";

import IncomeProjectionWidget from "./IncomeProjectionWidget";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("common/RowHeader", () => ({
  default: ({ title, caption }) => (
    <div>
      <h1>{title}</h1>
      <p>{caption}</p>
    </div>
  ),
}));

vi.mock("features/Rent/components/MyReports/SeriesChart", () => ({
  default: ({ label }) => <div>{label}</div>,
}));

vi.mock("features/Rent/components/MyReports/ PieChart", () => ({
  default: ({ label }) => <div>{label}</div>,
}));

vi.mock("features/Rent/hooks/useCalculateProjectedRentalChange", () => ({
  useCalculateProjectedRentalChange: vi.fn(() => [100, 200]),
}));

vi.mock("features/Rent/hooks/useCalculateTotalCollectedRents", () => ({
  useCalculateTotalCollectedRents: vi.fn(() => ({
    collected: 5000,
  })),
}));

describe("IncomeProjectionWidget", () => {
  it("renders the widget with charts", () => {
    render(
      <IncomeProjectionWidget
        properties={[{ rentIncrement: 100 }, { rentIncrement: 200 }]}
        existingRents={[]}
      />,
    );

    expect(screen.getByText("Rental Income Projection")).toBeInTheDocument();

    expect(
      screen.getByText("View rental income projection and collected rents"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Average Rental Income Projection"),
    ).toBeInTheDocument();

    expect(screen.getByText("Total Collected Rents")).toBeInTheDocument();
  });
});
