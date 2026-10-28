import React from "react";

import {
  AccountBalanceWalletRounded,
  ApartmentRounded,
  AtmRounded,
  BusinessRounded,
  DomainRounded,
  GroupsRounded,
  HomeRounded,
  MonetizationOnRounded,
  MoneyRounded,
  PeopleRounded,
  Person2Rounded,
  PersonRounded,
} from "@mui/icons-material";

// Enum Constants ...
export const AddPropertyTextString = "ADD_PROPERTY";
export const AddRentRecordsTextString = "ADD_RENT_RECORDS";
export const AddMaintenanceRecordTextString = "ADD_MAINTENANCE_RECORD";

// MaxSizeInMB ...
export const MaxSizeInMB = 5;
// FileUploadWaitingStatusStr ...
export const FileUploadWaitingStatusStr = "waiting";
// FileUploadUploadingStatusStr ...
export const FileUploadUploadingStatusStr = "uploading";
// FileUploadUploadedStatusStr ...
export const FileUploadUploadedStatusStr = "uploaded";
// FileUploadFailedStatusStr ...
export const FileUploadFailedStatusStr = "failed";

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

export const MaintenanceIssueCreatedResolutionType = "Created";
export const MaintenanceIssuePendingResolutionType = "Pending";
export const MaintenanceIssueInprogressResolutionType = "Inprogress";
export const MaintenanceIssueIncompleteResolutionType = "Incomplete";
export const MaintenanceIssueCompletedResolutionType = "Completed";

// DefaultMaintenanceIssueResolutionTypes ...
// defines the default maintenance issue resolution choices1
export const DefaultMaintenanceIssueResolutionTypes = [
  {
    id: 1,
    label: "Created",
    action: MaintenanceIssueCreatedResolutionType,
  },
  {
    id: 2,
    label: "Pending",
    action: MaintenanceIssuePendingResolutionType,
  },
  {
    id: 3,
    label: "In progress",
    action: MaintenanceIssueInprogressResolutionType,
  },
  {
    id: 4,
    label: "Incomplete",
    action: MaintenanceIssueIncompleteResolutionType,
  },
  {
    id: 5,
    label: "Completed",
    action: MaintenanceIssueCompletedResolutionType,
  },
];

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

export const STARTER_PLAN_PRODUCT_NAME = "Monthly Starter Plan";
export const PROFESSIONAL_PLAN_PRODUCT_NAME = "Monthly Professional Plan";
export const ENTERPRISE_PLAN_PRODUCT_NAME = "Monthly Enterprise Plan";

// DefaultRentXPropertiesLimit ...
// defines the max amount of authorized properties for each plan
export const DefaultRentXPropertiesLimit = {
  [STARTER_PLAN_PRODUCT_NAME]: 2,
  [PROFESSIONAL_PLAN_PRODUCT_NAME]: 10,
  [ENTERPRISE_PLAN_PRODUCT_NAME]: 20,
};

const FIRST_PROPERTY_VALUE = "first_property";
const FIVE_PROPERTIES_VALUES = "five_properties";
const TEN_PROPERTIES_VALUE = "ten_properties";
const TWENTY_FIVE_PROPERTIES_VALUE = "twenty_five_properties";
const FIFTY_PROPERTIES_VALUE = "fifty_properties";

// PropertiesBadges ...
// defines a list of badges that can be allocated in relationship to properties.
// Should tally against the number of properties under the logged in user
export const PropertiesBadges = {
  1: {
    value: FIRST_PROPERTY_VALUE,
    title: "First Property",
    description: "Added your first property",
    icon: <HomeRounded fontSize="small" />,
  },
  5: {
    value: FIVE_PROPERTIES_VALUES,
    title: "Growing Portfolio",
    description: "Added 5 properties",
    icon: <ApartmentRounded fontSize="small" />,
  },
  10: {
    value: TEN_PROPERTIES_VALUE,
    title: "Portfolio Builder",
    description: "Added 10 properties",
    icon: <BusinessRounded fontSize="small" />,
  },
  25: {
    value: TWENTY_FIVE_PROPERTIES_VALUE,
    title: "Property Pro",
    description: "Built a portfolio of 25 properties",
    icon: <DomainRounded fontSize="small" />,
  },
  50: {
    value: FIFTY_PROPERTIES_VALUE,
    title: "Portfolio Powerhouse",
    description: "Built a portfolio of 50 properties",
    icon: <DomainRounded fontSize="small" />,
  },
};

const FIRST_RENTAL_INCOME_VALUE = "first_rental_income";
const FIVE_RENTAL_INCOME_VALUE = "five_rental_income";
const TEN_RENTAL_INCOME_VALUE = "ten_rental_income";
const TWENTY_FIVE_RENTAL_INCOME_VALUE = "twenty_five_rental_income";

// RentIncomeBadges ...
// defines a function that populates badges for each corrosponding rental income
export const RentIncomeBadges = {
  1: {
    value: FIRST_RENTAL_INCOME_VALUE,
    title: "First Rental Income",
    description: "Generated your first rental income",
    icon: <MoneyRounded fontSize="small" />,
  },
  5: {
    value: FIVE_RENTAL_INCOME_VALUE,
    title: "Fifth Rental Income",
    description: "Generated your fifth rental income",
    icon: <AccountBalanceWalletRounded fontSize="small" />,
  },
  10: {
    value: TEN_RENTAL_INCOME_VALUE,
    title: "Tenth Rental Income",
    description: "Generated your tenth rental income",
    icon: <MonetizationOnRounded fontSize="small" />,
  },
  25: {
    value: TWENTY_FIVE_RENTAL_INCOME_VALUE,
    title: "Twenty fifth Rental Income",
    description: "Generated your twenty fifth rental income",
    icon: <AtmRounded fontSize="small" />,
  },
};

const FIRST_TENANT_VALUE = "first_tenant";
const FIVE_TENANTS_VALUE = "five_tenant";
const TEN_TENANTS_VALUE = "ten_tenant";
const TWENTY_FIVE_TENANTS_VALUE = "twenty_five_tenant";

// AssociatedTenantsBadges ...
// defines a function that populates badges for each associated tenants
export const AssociatedTenantsBadges = {
  1: {
    value: FIRST_TENANT_VALUE,
    title: "First Associated Tenant",
    description: "Associated your first tenant",
    icon: <PersonRounded fontSize="small" />,
  },
  5: {
    value: FIVE_TENANTS_VALUE,
    title: "Fifth Associated Tenant",
    description: "Associated your fifth tenant",
    icon: <PeopleRounded fontSize="small" />,
  },
  10: {
    value: TEN_TENANTS_VALUE,
    title: "Tenth Associated Tenant",
    description: "Associated your tenth tenant",
    icon: <Person2Rounded fontSize="small" />,
  },
  25: {
    value: TWENTY_FIVE_TENANTS_VALUE,
    title: "Twenty fifth Associated Tenant",
    description: "Associated your twenty-fifth tenant",
    icon: <GroupsRounded fontSize="small" />,
  },
};

const FIRST_MAINTENANCE_VALUE = "first_maintenance";
const FIVE_MAINTENANCE_VALUE = "five_maintenance";
const TEN_MAINTENANCE_VALUE = "ten_maintenance";
const TWENTY_FIVE_MAINTENANCE_VALUE = "twenty_five_maintenance";

// CompletedMaintenanceBadges ...
// defines a function that populates badges for each completed maintenance request
export const CompletedMaintenanceBadges = {
  1: {
    value: FIRST_MAINTENANCE_VALUE,
    title: "First Maintenace Request Completed",
    description: "Completed your first maintenance request",
    icon: <PersonRounded fontSize="small" />,
  },
  5: {
    value: FIVE_MAINTENANCE_VALUE,
    title: "Fifth Maintenace Request Completed",
    description: "Completed your fifth maintenance request",
    icon: <PeopleRounded fontSize="small" />,
  },
  10: {
    value: TEN_MAINTENANCE_VALUE,
    title: "Tenth Maintenace Request Completed",
    description: "Completed your tenth maintenance request",
    icon: <Person2Rounded fontSize="small" />,
  },
  25: {
    value: TWENTY_FIVE_MAINTENANCE_VALUE,
    title: "Twenty fifth Maintenace Request Completed",
    description: "Completed your twenty-fifth maintenance request",
    icon: <GroupsRounded fontSize="small" />,
  },
};
