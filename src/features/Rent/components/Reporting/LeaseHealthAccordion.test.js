import React from "react";

import LeaseHealthAccordion from "./LeaseHealthAccordion";
import { render, screen } from "@testing-library/react";

describe("LeaseHealthAccordion", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-29T12:00:00.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders and calculates lease health metrics correctly", () => {
    const existingTenants = [
      {
        propertyId: 1,
        startDate: "2026-01-01T00:00:00.000Z",
        gracePeriod: 4,
        term: "1y",
      },
      {
        propertyId: 2,
        startDate: "2026-06-01T00:00:00.000Z",
        gracePeriod: 4,
        term: "6m",
      },
    ];

    render(
      <LeaseHealthAccordion
        label="Lease Health"
        selected={1}
        existingTenants={existingTenants}
      />,
    );

    expect(screen.getByText("Lease Health")).toBeInTheDocument();

    expect(screen.getByText("Lease expires in")).toBeInTheDocument();
    expect(screen.getByText("216 days")).toBeInTheDocument();
    expect(screen.getByText("Occupied since 01-01-2026")).toBeInTheDocument();

    expect(screen.getByText("Tenant tenure")).toBeInTheDocument();
    expect(screen.getByText("148 days")).toBeInTheDocument();
    expect(screen.getByText("Since 01-01-2026")).toBeInTheDocument();

    expect(screen.getByText("Renewal Rate")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("1 out of 2 tenants renewed")).toBeInTheDocument();

    expect(screen.getByText("Avg lease length")).toBeInTheDocument();
    expect(screen.getByText("1y")).toBeInTheDocument();
    expect(screen.getByText("Across all tenants")).toBeInTheDocument();
  });
});
