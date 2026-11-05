// getActiveFilters ...
// defines a function that returns all filters in a widget
export const getActiveFilters = (filters = {}) =>
  Object.values(filters).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (value && typeof value === "object") {
      return Object.keys(value).length > 0;
    }

    return value !== undefined && value !== null && value !== "";
  });
