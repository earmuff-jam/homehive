// ReportOverview.test.jsx
import React from "react";

import ReportOverview from "./ReportOverview";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/components/MyReports/PortfolioHealth", () => ({
  default: () => <div>Portfolio Health</div>,
}));

vi.mock("features/Rent/components/MyReports/FinancialHealthAccordion", () => ({
  default: () => <div>Financial Health</div>,
}));

vi.mock("features/Rent/hooks/useCalculatePropertyHealth", () => ({
  useCalculatePropertyHealth: vi.fn(() => ({
    score: 90,
  })),
}));

vi.mock("features/Rent/hooks/useCalculateFinancialHealth", () => ({
  useCalculateFinancialHealth: vi.fn(() => ({
    score: 85,
  })),
}));

describe("ReportOverview", () => {
  it("renders portfolio and financial health", () => {
    render(<ReportOverview properties={[]} />);

    expect(screen.getByText("Portfolio Health")).toBeInTheDocument();
    expect(screen.getByText("Financial Health")).toBeInTheDocument();
  });
});
