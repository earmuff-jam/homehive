import React from "react";

import PropertyHealthAccordion from "./PropertyHealthAccordion";
import { render, screen } from "@testing-library/react";

jest.mock("features/Rent/utils", () => ({
  getOccupancyRate: jest.fn(() => 66),
}));

jest.mock("common/AIconButton", () => ({
  __esModule: true,
  default: (props) => <button {...props} />,
}));

describe("PropertyHealthAccordion", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-29"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("PropertyHealthAccordion without a valid rentee", () => {
    it("renders and calculates property health metrics correctly", () => {
      const properties = [
        {
          id: 1,
          name: "Test Property",
          moveOutDate: "2026-05-01",
          rentee: [],
        },
      ];

      const existingTenants = [
        {
          propertyId: 1,
          startDate: "2026-05-11",
          isSoR: false,
          gracePeriod: 4,
        },
      ];

      render(
        <PropertyHealthAccordion
          label="Property Health"
          selected={1}
          properties={properties}
          existingTenants={existingTenants}
        />,
      );

      expect(screen.getByText("Property Health")).toBeInTheDocument();

      expect(screen.getByText("Current Vacancy Streak")).toBeInTheDocument();
      expect(screen.getByText("0 days")).toBeInTheDocument();

      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("66%")).toBeInTheDocument();

      expect(screen.getByText("Avg days to fill")).toBeInTheDocument();
      expect(screen.getByText("Total Vacancy days")).toBeInTheDocument();

      expect(screen.getAllByText("10 days")).toHaveLength(2);

      expect(screen.getByText("Occupied since 05-11-2026")).toBeInTheDocument();
    });
  });

  describe("PropertyHealthAccordion with a valid rentee", () => {
    it("renders and calculates property health metrics correctly", () => {
      const properties = [
        {
          id: 1,
          moveOutDate: "2026-05-01",
          rentee: [], // no tenant should exist to calculate vacancy
        },
        {
          id: 2,
          moveOutDate: "2026-05-01",
          rentee: ["shouldNotUseThisUserAnyways@aol.com"],
        },
      ];

      const existingTenants = [
        {
          propertyId: 1,
          startDate: "2026-05-11", // 10 days after move out
          gracePeriod: 4,
          isSoR: false,
        },
      ];

      render(
        <PropertyHealthAccordion
          label="Property Health"
          selected={1}
          properties={properties}
          existingTenants={existingTenants}
        />,
      );

      expect(screen.getByText("Property Health")).toBeInTheDocument();

      expect(screen.getByText("Current Vacancy Streak")).toBeInTheDocument();
      expect(screen.getByText("0 days")).toBeInTheDocument();

      expect(screen.getByText("Occupancy Rate")).toBeInTheDocument();
      expect(screen.getByText("66%")).toBeInTheDocument();

      expect(screen.getByText("Avg days to fill")).toBeInTheDocument();
      expect(screen.getByText("19 days")).toBeInTheDocument();

      expect(screen.getByText("Total Vacancy days")).toBeInTheDocument();
      expect(screen.getByText("19 days")).toBeInTheDocument();

      expect(screen.getByText("Occupied since 05-11-2026")).toBeInTheDocument();
    });
  });
});
