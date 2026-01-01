import React from "react";

import secureLocalStorage from "react-secure-storage";

/**
 * Utility file for properties
 */
import dayjs from "dayjs";

import {
  AssignmentLateRounded,
  MoneyOffRounded,
  PaidRounded,
} from "@mui/icons-material";
import validateClientPermissions from "common/ValidateClientPermissions";
import { LEASE_TERM_MENU_OPTIONS } from "features/Rent/common/constants";
import { produce } from "immer";

// ---------------------------
// enum values

// stripe rent status
export const PaidRentStatusEnumValue = "paid";
export const ManualRentStatusEnumValue = "manual";

// template processor actions
export const CreateInvoiceEnumValue = "Create_Invoice";
export const SendDefaultInvoiceEnumValue = "Send_Default_Invoice";
export const PaymentReminderEnumValue = "Payment_Reminder";
export const RenewLeaseNoticeEnumValue = "Renew_Lease_Notice_Enum_Value";

/**
 * stripHTMLForEmailMessages ...
 *
 * fn used to strip html messages for plain text formatting.
 * this is done so to act as a fallback for clients who do not
 * have email setup
 *
 * @param {Document} htmlDocument
 * @returns Document - cleaned up version of the document without any tags or formatting
 */
export const stripHTMLForEmailMessages = (htmlDocument) => {
  const div = document.createElement("div");
  div.innerHTML = htmlDocument;
  return div.textContent || div.innerText || "";
};

/**
 * Email Validators
 */
const emailValidators = [
  {
    validate: (value) => value.trim().length <= 0,
    message: "Email address is required",
  },
  {
    validate: (value) => value.trim().length >= 150,
    message: "Email address should be less than 150 characters",
  },
  {
    validate: (value) => !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value),
    message: "Email address is not valid",
  },
];

/**
 * isValid ...
 *
 * function used to determine if an email is valid or not
 *
 * @param {string} email
 * @returns boolean - true / false
 */
export const isValid = (email) => {
  for (const validator of emailValidators) {
    if (validator.validate(email)) {
      return false;
    }
  }
  return true;
};

/**
 * fetchLoggedInUser ...
 *
 * used to retrieve the logged in userId.
 *
 * @returns string - the logged in userId
 */
export const fetchLoggedInUser = () => {
  return secureLocalStorage.getItem("user");
};

/**
 * updateDateTime function
 *
 * util function used to updateDateTime. used to update the
 * next projected rent due date
 *
 * @param {string} startDate - the start date of the event
 * @returns updatedDateTime with a month added.
 */
export const updateDateTime = (startDate) => {
  const today = dayjs();
  const monthsSinceStart = today.diff(startDate, "month");
  const nextDueDate = startDate.add(monthsSinceStart + 1, "month");
  return dayjs(nextDueDate).toISOString();
};

/**
 * formatCurrency ...
 *
 * used to format the current passed in amount.
 *
 * @param {Number} amount - the amount that needs to be formatted, default 0
 *
 * @returns {Number} formatted result
 */
export const formatCurrency = (amt = 0) => {
  return amt.toFixed(2);
};

/**
 * sumCentsToDollars ...
 *
 * used to sum the total for all the provided args
 *
 * @param  {...String} values - String representation of numbers in cents
 * @returns sum of the total numbers in dollars
 */
export const sumCentsToDollars = (...values) => {
  return values.reduce((total, val) => {
    const num = Number(val || 0);
    return total + (isNaN(num) ? 0 : num / 100);
  }, 0);
};

/**
 * derieveTotalRent
 *
 * function used to retrieve the total rent of any given property. For homes
 * with a SoR, rent are calculated per room. The property unit as a whole can have
 * additional charges.
 *
 * @param {Object} property - the property object
 * @param {Array} tenants - the array of tenants that are residing in the property
 * @param {Boolean} isAnyTenantSoR - true / false - determine if the property is single occupancy or not
 *
 * @returns {Number} - amount of rent in US Dollars
 */
export const derieveTotalRent = (property, tenants, isAnyTenantSoR) => {
  const totalRent =
    Number(property?.rent || 0) + Number(property?.additional_rent || 0); // can have additional charges

  if (isAnyTenantSoR) {
    return tenants.reduce(
      (total, tenant) =>
        total +
        parseInt(tenant.rent || 0) +
        parseInt(property?.additional_rent),
      0,
    );
  } else {
    return totalRent || 0;
  }
};

/**
 * getOccupancyRate ...
 *
 * function used to determine the occupancy rate of the selected
 * property.
 *
 * @param {Object} property - the property object
 * @param {Array} tenants - the array of tenants that are residing in the property
 * @param {Boolean} isAnyTenantSoR - true / false - determine if the property is single occupancy or not
 *
 * @returns {Number} - the percent of the occupancy of the selected property
 */
export const getOccupancyRate = (property, tenants, isAnyTenantSoR) => {
  if (isAnyTenantSoR) {
    const totalUnits = parseInt(property?.units || 0);
    const occupiedUnits = tenants.length;
    return totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  } else {
    // if !SoR, all tenants count as 1 household member. hence 100% occupancy rate
    return tenants?.length > 0 ? 100 : 0;
  }
};

/**
 * getNextMonthlyDueDate ...
 *
 *
 * function used to return next due date (monthly) based on the original lease start date.
 *
 * @param {string | Date} startDate - The tenant's lease start date.
 * @returns {string} - The next due date in YYYY-MM-DD format.
 */
export function getNextMonthlyDueDate(startDate) {
  if (!startDate) return "";

  const original = dayjs(startDate);
  const today = dayjs();
  const targetDay = original.date();

  const nextDue =
    today.date() <= targetDay
      ? today.set("date", targetDay)
      : today.add(1, "month").set("date", targetDay);

  return nextDue.format("YYYY-MM-DD");
}

/**
 * getColorAndLabelForCurrentMonth ...
 *
 * used to return label, color and icon for the current month based on rent status.
 *
 * @param {String} startDate - the startDate of the tenant
 * @param {Object} rent - the rent details for the current month
 * @param {Number} gracePeriod - the days grace period is provided. Defaults to 3.
 * @returns {Object} { color: string, label: string, icon: React.ReactNode }
 */
export const getColorAndLabelForCurrentMonth = (
  startDate,
  rent,
  gracePeriod = 3,
) => {
  if (!rent || !startDate) return false;

  const leaseStart = dayjs(startDate, "MM-DD-YYYY");
  if (dayjs().isBefore(leaseStart, "day")) return false;
  const graceDate = dayjs().startOf("month").add(gracePeriod, "day");
  const pastGracePeriod = dayjs().isAfter(graceDate, "day");

  if (
    rent?.status.toLowerCase() === PaidRentStatusEnumValue ||
    rent?.status.toLowerCase() === ManualRentStatusEnumValue
  ) {
    return { color: "success", label: "Paid", icon: <PaidRounded /> };
  } else if (pastGracePeriod) {
    return {
      color: "error",
      label: "Overdue",
      icon: <AssignmentLateRounded />,
    };
  } else {
    return { color: "warning", label: "Unpaid", icon: <MoneyOffRounded /> };
  }
};

/**
 * Checks if rent is currently due.
 *
 * @param {string} startDate - The lease start date in MM-DD-YYYY format.
 * @param {number} gracePeriodDays - Number of grace days before rent is due each month.
 * @param {Array} currentMonthRent - Rent details if exists, for the current month.
 *
 * @returns {boolean} - True if rent is currently due.
 */

export const isRentDue = (startDate, gracePeriod = 3, currentMonthRent) => {
  const today = dayjs();
  const leaseStart = dayjs(startDate, "MM-DD-YYYY");

  if (today.isBefore(leaseStart, "day")) return false;

  const graceDate = today.startOf("month").add(gracePeriod, "day");
  const pastGracePeriod = today.isAfter(graceDate, "day");

  const currentMonth = today.format("MMMM");
  const rentPaid =
    currentMonthRent?.rentMonth === currentMonth &&
    currentMonthRent.status?.toLowerCase() === "paid";
  return pastGracePeriod && !rentPaid;
};

/**
 * getRentStatus ...
 *
 * function used to get the rent status
 * @param {Object} { isPaid, isLate } - object containing these values
 * @returns Object containing the color and label. Eg, { color: "warning", label: "Unpaid" }
 */
export function getRentStatus({ isPaid, isLate }) {
  if (isPaid) return { color: "success", label: "Paid" };
  if (isLate) return { color: "error", label: "Overdue" };
  return { color: "warning", label: "Unpaid" };
}

/**
 * getRentDetails...
 *
 * used to retrieve rent details for a specific month. defaults to
 * the current month
 *
 * @export
 * @param {Array} [data=[]] - The data that needs to be filtered
 * @param {string} [currentMonth=dayjs().format("MMMM")] - The specific month, defaults to current
 * @returns {Object} - The rent details that match the provided params
 */
export function getRentDetails(
  data = [],
  currentMonth = dayjs().format("MMMM"),
) {
  return data.find(
    (rent) =>
      rent.rentMonth === currentMonth &&
      (PaidRentStatusEnumValue === rent.status?.toLowerCase() ||
        ManualRentStatusEnumValue === rent.status?.toLowerCase()),
  );
}

/**
 * isAssociatedPropertySoR ...
 *
 * function used to determine if an associated property is of the type SoR.
 * takes property and tenants associated with that property into account.
 *
 * @param {Object} Object - Object that defines a single property
 * @param {Array} tenants - Array of tenants
 * @returns boolean - true or false value
 */
export const isAssociatedPropertySoR = (property, tenants) => {
  if (tenants?.length <= 0) return true;
  return (
    property?.rentees?.length > 0 &&
    tenants.some((tenant) => tenant.isActive && tenant.isSoR)
  );
};

/**
 * buildPaymentLineItems ...
 *
 * function used to build payment line items for stripe payment services
 *
 * @param {Object} property - the property object
 * @param {Object} tenant - the tenant residing at the selected property
 * @returns Array - list of payment line item objects
 */
export const buildPaymentLineItems = (property = {}, tenant = []) => {
  return [
    {
      name: {
        label: "Rent Amount",
        value: Number(property?.rent) || 0,
      },
    },
    {
      name: {
        label: "Additional Charges",
        value: Number(property?.additional_rent) || 0,
      },
    },
    {
      name: {
        label: "Initial Late fee",
        value: Number(tenant?.initialLateFee) || 0,
      },
    },
    {
      name: {
        label: "Daily Late fee",
        value: Number(tenant?.dailyLateFee) || 0,
      },
    },
  ];
};

/**
 * isFeatureEnabled ...
 *
 * function used to check if a selected feature is available or not
 *
 * @param {string} key - the string representation of key
 * @returns boolean - true / false
 */
export const isFeatureEnabled = (key) => {
  const enabledFlagMap = validateClientPermissions();
  return enabledFlagMap.get(key) || false;
};

/**
 * convertFileToBase64Encoding ...
 *
 * converts a selected file into a base64 encoding
 *
 * @param {File} file - the file that is to be converted
 * @returns {Promise} new Promise - promise of converted file into base64 encoding
 */
export const convertFileToBase64Encoding = ({ file }) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

/**
 * sanitizeApiFields ...
 *
 * removes undefined or null fields from the provided object
 */
export const sanitizeApiFields = (obj = {}) =>
  /* eslint-disable no-unused-vars */
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null));

/**
 * sanitizeEsignFields ...
 *
 * builds the payload for Esign. removes undefined or null
 * @returns Object - the sanitized data
 */
export const sanitizeEsignFields = (
  rowData,
  property,
  propertyOwnerData,
  tenantData,
  primaryTenant,
) => {
  const draftData = produce(rowData, (draft) => {
    draft.id = rowData.uuid;
    draft.owner = validateFullName(
      propertyOwnerData?.first_name,
      propertyOwnerData?.last_name,
      propertyOwnerData?.googleDisplayName,
    );
    draft.ownerEmail = property?.owner_email;
    draft.tenant = validateFullName(
      tenantData?.first_name,
      tenantData?.last_name,
      tenantData?.googleDisplayName || primaryTenant.email,
    );
    draft.tenantEmail = primaryTenant.email;
    draft.address = property?.address;
    draft.city = property?.city;
    draft.state = property?.state;
    draft.zipCode = property?.zipCode;
    draft.county = property?.county;
    draft.startDate = dayjs(primaryTenant?.start_date).format("MM-DD-YYYY");
    draft.endDate = dayjs(
      derieveEndDate(primaryTenant?.start_date, primaryTenant?.term),
    ).format("MM-DD-YYYY");
    draft.isAutoRenew = primaryTenant?.isAutoRenewPolicySet;
    draft.autoRenewDays = primaryTenant?.autoRenewDays;
    draft.isMonthLastDate = true; // on month-month basis due date is last date flag
    draft.rent = property?.rent;
    draft.isFirstDayRent = true;
    draft.isPayToLandlord = true;
    draft.isPayToListingBroker = true;
    draft.isPayToPropertyManager = true;
    draft.rentDueDate = primaryTenant?.rentDueDate;
    draft.isCashiersCheck = true;
    draft.isElectronicPayment = true;
    draft.isMoneyOrder = true;
    draft.isPersonalCheck = true;
    draft.isOtherMeans = true;
    draft.proratedRent =
      Number(property?.rent || 0) + Number(property?.additionalRent || 0);
    draft.proratedRentDueDate = primaryTenant?.rentDueDate;
    draft.paymentID = property?.paymentID;
    draft.isExtraChargeNotAdded = false;
    draft.isMonthlyPaymentsRequired = true;
    draft.isInitialLateFee = true;
    draft.initialLateFee = primaryTenant?.initialLateFee;
    draft.dailyLateFee = primaryTenant?.dailyLateFee;
    draft.returnedPaymentFee = primaryTenant?.returnedPaymentFee;
    draft.initialAnimalViolationFee = primaryTenant?.initialAnimalVoilationFee;
    draft.dailyAnimalViolationFee = primaryTenant?.dailyAnimalVoilationFee;
    draft.securityDeposit = property?.securityDeposit;
    draft.ownerCoveredUtilities = property?.ownerCoveredUtilities; // comma seperated string
    draft.isHoa = property?.isHoa;
    draft.isNotHoa = !property?.isHoa;
    draft.hoaDetails = property?.hoaDetails; // details string seperated
    draft.guestsPermittedStayDays = primaryTenant?.guestsPermittedStayDays;
    draft.allowedVehicleCounts = property?.allowedVehicleCounts;
    draft.tripCharge = primaryTenant?.tripCharge; // cost to pay to owner if the owner has to do smth for tenant
    draft.allowKeyboxSince = primaryTenant?.allowKeyboxSince;
    draft.removeKeyboxFee = primaryTenant?.removeKeyboxFee;
    draft.inventoryCompleteWithin = primaryTenant?.inventoryCompleteWithin;
    draft.isTenantCleaningYard = property?.isTenantCleaningYard;
    draft.isSmokingNotAllowed = !property?.isSmoking;
    draft.emergencyContactNumber = property?.emergencyContactNumber;
    draft.specialProvisions = property?.specialProvisions; // extra rules for tenant, like addendum
    draft.rentalFloodDisclosure = true; // all rental properties are required to submit rental flood disclosures
    draft.brokerName = property?.brokerName;
    draft.isBrokerManaged = property?.isBrokerManaged;
    draft.isNotBrokerManaged = !property?.isBrokerManaged;
    // owner managed if others do not manage the property
    draft.isOwnerManaged =
      !property?.isBrokerManaged && !property?.isManagerManaged;
    draft.isManagerManaged = property?.isManagerManaged;
    draft.managerName = property?.managerName;
    draft.managerAddress = property?.managerAddress;
    draft.managerPhone = property?.managerPhone;
  });

  return sanitizeApiFields(draftData);
};

/**
 * derieveEndDate ...
 *
 * uses LEASE_TERM_MENU_OPTIONS to derieve the endDate of the provided startDate.
 * primarily used for lease end date calculations in ISO format
 */
const derieveEndDate = (startDate, lengthOfStay) => {
  const lengthOfStayValue = LEASE_TERM_MENU_OPTIONS.find(
    (option) => option.value === lengthOfStay,
  );
  const endDate = dayjs(startDate).add(lengthOfStayValue?.amount, "month");
  return endDate.toISOString();
};

/**
 * validateFullName ...
 *
 * function used to validate the full name of the user
 */
const validateFullName = (firstName, lastName, otherName) => {
  if (!firstName || !lastName) {
    return otherName || "";
  } else if (firstName && lastName) {
    return `${firstName}, ${lastName}`;
  } else {
    return "N/A";
  }
};
