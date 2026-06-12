// Enum Constants ...
export const AddPropertyTextString = "ADD_PROPERTY";
export const AddRentRecordsTextString = "ADD_RENT_RECORDS";
export const AddMaintenanceRecordTextString = "ADD_MAINTENANCE_RECORD";

export const AddMaintenanceRecordCompletedResolutionString =
  "ADD_MAINTENANCE_COMPLETED_RECORD_RESOLUTION";
export const AddMaintenanceRecordPendingResolutionString =
  "ADD_MAINTENANCE_PENDING_RECORD_RESOLUTION";
export const AddMaintenanceRecordRemovedResolutionString =
  "ADD_MAINTENANCE_REMOVED_RECORD_RESOLUTION";

// DefaultLeaseTermOptions ...
export const DefaultLeaseTermOptions = [
  {
    id: 1,
    value: "1m",
    amount: "1",
    label: "1 month",
  },
  {
    id: 2,
    value: "2m",
    amount: 2,
    label: "2 months",
  },
  {
    id: 3,
    value: "3m",
    amount: 3,
    label: "3 months",
  },
  {
    id: 4,
    value: "6m",
    amount: 6,
    label: "6 months",
  },
  {
    id: 5,
    value: "1y",
    amount: 12,
    label: "1 year",
  },
  {
    id: 6,
    value: "2y",
    amount: 24,
    label: "2 years",
  },
];

// DefaultAccordionOptions ...
// defines the default accordion options
export const DefaultAccordionOptions = [
  {
    id: 1,
    label: "Vacancy & Occupancy",
  },
  {
    id: 2,
    label: "Lease Health",
  },
  {
    id: 3,
    label: "Rent Collection",
  },
  {
    id: 4,
    label: "Maintenance",
  },
];

// MaintenanceRecordEnumValues ...
// maintenance record enum values for created records
export const MaintenanceRecordEnumValues = {
  Created: "Created",
  Pending: "Pending",
  Inprogress: "In Progress",
  Incomplete: "Incomplete",
  Completed: "Completed",
};

// DefaultMaintenanceCategoryTypes ...
// defines a function that populates the default maintenance categories
export const DefaultMaintenanceCategoryTypes = [
  {
    id: 1,
    label: "Plumbing",
  },
  {
    id: 2,
    label: "HVAC",
  },
  {
    id: 3,
    label: "Electrical",
  },
  {
    id: 4,
    label: "Appliances",
  },
  {
    id: 5,
    label: "Exterior",
  },
  {
    id: 6,
    label: "Pest Control",
  },
  {
    id: 7,
    label: "General Repair",
  },
];
