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

  it("should return true when there is a maintenance record within the last 7 days that is not completed", () => {
    const data = [
      {
        createdOn: dayjs().subtract(3, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Pending,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, false),
    );

    expect(result.current.isRecentRecord).toBe(true);
  });

  it("should return false when the only recent record is completed", () => {
    const data = [
      {
        createdOn: dayjs().subtract(2, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, false),
    );

    expect(result.current.isRecentRecord).toBe(false);
  });

  it("should return false when all records are older than 7 days", () => {
    const data = [
      {
        createdOn: dayjs().subtract(8, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Pending,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, false),
    );

    expect(result.current.isRecentRecord).toBe(false);
  });

  it("should return true if at least one record matches", () => {
    const data = [
      {
        createdOn: dayjs().subtract(10, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Pending,
      },
      {
        createdOn: dayjs().subtract(1, "day").toISOString(),
        status: MaintenanceRecordEnumValues.InProgress,
      },
      {
        createdOn: dayjs().subtract(2, "day").toISOString(),
        status: MaintenanceRecordEnumValues.Completed,
      },
    ];

    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(data, false),
    );

    expect(result.current.isRecentRecord).toBe(true);
  });

  it("should return false when data is empty", () => {
    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails([], false),
    );

    expect(result.current.isRecentRecord).toBe(false);
  });

  it("should return false when data is undefined", () => {
    const { result } = renderHook(() =>
      useCalculateMaintenanceDetails(undefined, false),
    );

    expect(result.current.isRecentRecord).toBe(false);
  });
});
