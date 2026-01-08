
import dayjs, { Dayjs } from "dayjs";

import {
  AssignmentLateRounded,
  MoneyOffRounded,
  PaidRounded,
} from "@mui/icons-material";
import rootLevelEnabledFeatures from "common/utils";
import { LEASE_TERM_MENU_OPTIONS } from "features/Rent/common/constants";
import { produce } from "immer";
import { TPaymentStatusEnumValues, TProperty, TTemplateProcessorEnumValues } from "features/Rent/types/Rent.types";
import { TUser } from "src/types";

// enum values
export const PaidRentStatusEnumValue: TPaymentStatusEnumValues = "paid";
export const ManualRentStatusEnumValue: TPaymentStatusEnumValues = "manual";
export const CreateInvoiceEnumValue: TTemplateProcessorEnumValues = "CreateInvoice";
export const SendDefaultInvoiceEnumValue: TTemplateProcessorEnumValues = "SendDefaultInvoice";
export const PaymentReminderEnumValue: TTemplateProcessorEnumValues = "PaymentReminder";
export const RenewLeaseNoticeEnumValue: TTemplateProcessorEnumValues = "RenewLeaseNotice";

// stripHTMLForEmailMessages ...
export const stripHTMLForEmailMessages = (htmlDocument) => {
  const div = document.createElement("div");
  div.innerHTML = htmlDocument;
  return div.textContent || div.innerText || "";
};

// displayNextPaymentDueDate ...
export const displayNextPaymentDueDate = (startDate: Dayjs): Dayjs => {
  const today = dayjs();
  const monthsSinceStart = today.diff(startDate, "month");
  const nextDueDate = startDate.add(monthsSinceStart + 1, "month");
  return nextDueDate;
};

// formatCurrency ...
// defines function to format provided number into currency type
export const formatCurrency = (amt: number = 0): string => {
  return amt.toFixed(2);
};

// sumCentsToDollars ...
// defines function to count all total cents and convert to dollar amount
export const sumCentsToDollars = (...values: number[]) : number => {
  return values.reduce((total, val) => {
    return total + (isNaN(val) ? 0 : val / 100);
  }, 0);
};

// derieveTotalRent ...
// defines a function used to fetch total rent based on property, tenants and tenants w/o SoR occupancy. Also adds additional charges. Does NOT take late fee into account
export const derieveTotalRent = (property: TProperty, tenants, isAnyTenantSoR: boolean) => {

  const totalRent = property.rent + property.additionalRent;
  if (isAnyTenantSoR) {
    return tenants.reduce(
      (total: number, tenant) =>
        total +
        tenant.rent +
        property.additionalRent,
      0,
    );
  } else {
    return totalRent;
  }
};

// getOccupancyRate ...
export const getOccupancyRate = (property:TProperty, tenants, isAnyTenantSoR: boolean): number => {
  if (isAnyTenantSoR) {
    const totalUnits = property.units;
    const occupiedUnits = tenants.length;
    return totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  } else {
    // if !SoR, all tenants count as 1 household member.
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

// what is the difference between this and displayNextPaymentDueDate /// ?????
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
 * The function `getRentDetails` retrieves rent details for the current month based on the provided
 * data array and rent status criteria.
 * @returns The `getRentDetails` function returns an object from the `data` array that matches the
 * current month and has a status that matches either the `PaidRentStatusEnumValue` or
 * `ManualRentStatusEnumValue`.
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
 * The function `isAssociatedPropertySoR` checks if a property has active tenants who are on a standard
 * or regulated tenancy.
 * @returns The function `isAssociatedPropertySoR` returns a boolean value.
 */
export const isAssociatedPropertySoR = (property, tenants) => {
  if (tenants?.length <= 0) return true;
  return (
    property?.rentees?.length > 0 &&
    tenants.some((tenant) => tenant.isActive && tenant.isSoR)
  );
};

/**
 * The function `buildPaymentLineItems` creates an array of payment line items with labels and values
 * based on property and tenant information.
 * @returns The function `buildPaymentLineItems` returns an array of objects, where each object
 * represents a line item for payment. Each object has a `name` property containing a label and a
 * value. The label describes the type of payment (e.g., Rent Amount, Additional Charges, Initial Late
 * fee, Daily Late fee), and the value is the corresponding numerical amount retrieved from the
 * `property` and `tenant`.
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
 * The function isFeatureEnabled checks if a specific feature is enabled based on client permissions.
 * @returns The function `isFeatureEnabled` returns the value associated with the provided `key` in the
 * `enabledFlagMap`, or `false` if the key is not found in the map.
 */
export const isFeatureEnabled = (key) => {
  const enabledFlagMap = rootLevelEnabledFeatures();
  return enabledFlagMap.get(key) || false;
};

/**
 * The function `convertFileToBase64Encoding` takes a file as input and returns a Promise that resolves
 * to the base64 encoding of the file.
 */
export const convertFileToBase64Encoding = ({ file }) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

/**
 * The `sanitizeApiFields` function removes any key-value pairs from an object where the value is null
 * or undefined.
 */
export const sanitizeApiFields = (obj = {}) =>
  /* eslint-disable no-unused-vars */
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null));

/**
 * The function `sanitizeEsignFieldsForNewLease` sanitizes and prepares data fields for a new lease
 * agreement
 *
 * @returns The function `sanitizeEsignFieldsForNewLease` returns sanitized and updated data for a new
 * lease agreement, including information about the property, property owner, tenant, and lease terms.
 * The data is processed and modified using the `produce` function from the Immer library, and then
 * passed through the `sanitizeApiFields` function before being returned.
 */
export const sanitizeEsignFieldsForNewLease = (
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

    // attach 2nd document items as well
    draft.currentDate = dayjs().format("MM-DD-YYYY");
    draft.ownerNotAwareFloodplain = true; // default
    draft.ownerNotAwareWaterDamage = true; // default
  });

  return sanitizeApiFields(draftData);
};

/**
 * The function `sanitizeEsignFieldsForLeaseExtension` sanitizes and prepares data for a lease
 * extension document.
 * @returns The function `sanitizeEsignFieldsForLeaseExtension` returns the sanitized `draftData`
 * object with updated fields based on the input `rowData`, `property`, and `propertyOwnerData`.
 */
export const sanitizeEsignFieldsForLeaseExtension = (
  rowData,
  property,
  propertyOwnerData,
  primaryTenant,
) => {
  const draftData = produce(rowData, (draft) => {
    draft.id = rowData.uuid;
    draft.address = property?.address;
    draft.city = property?.city;
    draft.state = property?.state;
    draft.owner = validateFullName(
      propertyOwnerData?.first_name,
      propertyOwnerData?.last_name,
      propertyOwnerData?.googleDisplayName,
    );
    draft.dateOfExtension = dayjs().format("MM-DD-YYYY");
    draft.newExpirationDate = dayjs().add("12", "month").format("MM-DD-YYYY");
    draft.isRentChanged = property?.rent_increment > 0;
    draft.isRentNotChanged = property?.rent_increment === 0;
    draft.rentChangeAmt = property?.rent_increment;
    draft.expirationDate = dayjs().add("12", "month").format("MM-DD-YYYY");
    draft.isTenantNotVacating = true; // lease extension
    draft.isRentChanged = property?.rent_increment !== 0; // no rent increment
    draft.rentChangeAmount = property?.rent_increment;
    draft.isRentNotChanged = property?.rent_increment === 0;
    draft.isTenantVacating = true; // simulate tenant vacating for renew
    draft.endDate = dayjs(
      derieveEndDate(primaryTenant?.start_date, primaryTenant?.term),
    ).format("MM-DD-YYYY");
  });

  return sanitizeApiFields(draftData);
};

/**
 * The function `derieveEndDate` calculates the end date based on a given start date and length of
 * stay.
 * @returns The function `derieveEndDate` returns the end date calculated based on the provided start
 * date and length of stay. The end date is converted to an ISO string format before being returned.
 */
const derieveEndDate = (startDate, lengthOfStay) => {
  const lengthOfStayValue = LEASE_TERM_MENU_OPTIONS.find(
    (option) => option.value === lengthOfStay,
  );
  const endDate = dayjs(startDate).add(lengthOfStayValue?.amount, "month");
  return endDate.toISOString();
};

/**
 * The function `validateFullName` takes three parameters (firstName, lastName, otherName) and returns
 * a formatted full name or other name if first and last names are missing.
 * @returns The function `validateFullName` returns the full name in the format "firstName, lastName"
 * if both `firstName` and `lastName` are provided. If either `firstName` or `lastName` is missing, it
 * returns the `otherName` if provided, or an empty string if `otherName` is not provided. If none of
 * the names are provided, it returns "N/A".
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
