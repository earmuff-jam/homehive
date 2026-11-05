import { getActiveFilters } from "./getActiveFilters";
import { describe, expect, it } from "vitest";

describe("getActiveFilters", () => {
  it("returns an empty array when filters are undefined", () => {
    expect(getActiveFilters()).toEqual([]);
  });

  it("returns an empty array when filters are empty", () => {
    expect(getActiveFilters({})).toEqual([]);
  });

  it("includes non-empty arrays", () => {
    const filters = {
      invoiceIDs: ["invoice-1"],
    };

    expect(getActiveFilters(filters)).toEqual([["invoice-1"]]);
  });

  it("excludes empty arrays", () => {
    const filters = {
      invoiceIDs: [],
    };

    expect(getActiveFilters(filters)).toEqual([]);
  });

  it("includes non-empty objects", () => {
    const filters = {
      dateRange: {
        start: "2026-01-01",
      },
    };

    expect(getActiveFilters(filters)).toEqual([
      {
        start: "2026-01-01",
      },
    ]);
  });

  it("excludes empty objects", () => {
    const filters = {
      dateRange: {},
    };

    expect(getActiveFilters(filters)).toEqual([]);
  });

  it("includes non-empty strings", () => {
    const filters = {
      chartType: "bar",
    };

    expect(getActiveFilters(filters)).toEqual(["bar"]);
  });

  it("excludes empty strings", () => {
    const filters = {
      chartType: "",
    };

    expect(getActiveFilters(filters)).toEqual([]);
  });

  it("excludes undefined values", () => {
    const filters = {
      chartType: undefined,
    };

    expect(getActiveFilters(filters)).toEqual([]);
  });

  it("excludes null values", () => {
    const filters = {
      chartType: null,
    };

    expect(getActiveFilters(filters)).toEqual([]);
  });

  it("returns only active filters when multiple filter types are present", () => {
    const filters = {
      invoiceIDs: ["invoice-1", "invoice-2"],
      propertyIDs: [],
      chartType: "bar",
      dateRange: {},
      tenantIDs: null,
      search: "",
      active: undefined,
    };

    expect(getActiveFilters(filters)).toEqual([
      ["invoice-1", "invoice-2"],
      "bar",
    ]);
  });

  it("handles multiple active filters", () => {
    const filters = {
      invoiceIDs: ["invoice-1"],
      propertyIDs: ["property-1"],
      chartType: "line",
      dateRange: {
        start: "2026-01-01",
        end: "2026-09-01",
      },
    };

    expect(getActiveFilters(filters)).toEqual([
      ["invoice-1"],
      ["property-1"],
      "line",
      {
        start: "2026-01-01",
        end: "2026-09-01",
      },
    ]);
  });
});
