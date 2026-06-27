import dayjs from "dayjs";

import { useCalculateMaintenanceDetails } from "./useCalculateMaintenanceDetails";
import { renderHook } from "@testing-library/react";
import { MaintenanceRecordEnumValues } from "features/Rent/constants";

describe("useCalculateMaintenanceDetails", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-06-25"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should calculate costRentRatio correctly", () => {
    const data = [
      {
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().add(2, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: 100,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    expect(result.current.costRentRatio).toBe(0.1);
  });

  it("should calculate total spent for current year", () => {
    const data = [
      {
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: 200,
      },
      {
        createdOn: dayjs().subtract(2, "year").toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: 999,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    expect(result.current.totalSpentCurrentYear).toBe(200);
  });

  it("should calculate total spent for previous year", () => {
    const data = [
      {
        createdOn: dayjs().subtract(1, "year").toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: 300,
      },
      {
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: 100,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    expect(result.current.totalSpentPreviousYear).toBe(300);
  });

  it("should safely handle invalid cost values when calculating previous year total spent", () => {
    const lastYear = dayjs().subtract(1, "year");

    const data = [
      {
        createdOn: lastYear.toISOString(),
        updatedOn: dayjs().toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: "150",
      },
      {
        createdOn: lastYear.toISOString(),
        updatedOn: dayjs().toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: undefined,
      },
      {
        createdOn: lastYear.toISOString(),
        updatedOn: dayjs().toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: "invalid",
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    // only valid "150" should be counted
    expect(result.current.totalSpentPreviousYear).toBe(150);
  });

  it("should calculate average resolution time", () => {
    const data = [
      {
        createdOn: dayjs().subtract(2, "day").toISOString(),
        updatedOn: dayjs().toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
      },
      {
        createdOn: dayjs().subtract(4, "day").toISOString(),
        updatedOn: dayjs().subtract(2, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    // both are 2 days = 172800000ms each → avg = 172800000
    expect(result.current.averageResolutionTime).toContain("2d");
  });

  it("should return open maintenance records only", () => {
    const data = [
      {
        status: MaintenanceRecordEnumValues.Completed,
      },
      {
        status: MaintenanceRecordEnumValues.Pending,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    expect(result.current.openMaintenanceRecords.length).toBe(1);
  });

  it("should return isRecentRecord correctly", () => {
    const data = [
      {
        createdOn: dayjs().subtract(3, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Pending,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    expect(result.current.isRecentRecord).toBe(true);
  });

  it("should safely handle invalid or missing cost values when calculating total spent", () => {
    const data = [
      {
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: "100",
      },
      {
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: undefined,
      },
      {
        createdOn: dayjs().toISOString(),
        updatedOn: dayjs().add(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
        cost: "invalid",
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, 1000),
    );

    // only "100" should be counted
    expect(result.current.totalSpentCurrentYear).toBe(100);
  });

  it("should return false when data is empty", () => {
    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails([], 1000),
    );

    expect(result.current.isRecentRecord).toBe(false);
    expect(result.current.costRentRatio).toBe(0);
  });
});
