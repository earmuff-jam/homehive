import dayjs, { Dayjs } from "dayjs";

import {
  TPaymentStatusEnumValues,
  TProperty,
  TTemplateProcessorEnumValues,
  TTenant,
  TUpdatePropertyApiRequestEnumValues,
} from "features/Rent/Rent.types";
import { LEASE_TERM_MENU_OPTIONS } from "features/Rent/common/constants";
import { produce } from "immer";

// enum values
export const PaidRentStatusEnumValue: TPaymentStatusEnumValues = "paid";
export const ManualRentStatusEnumValue: TPaymentStatusEnumValues = "manual";
export const CreateInvoiceEnumValue: TTemplateProcessorEnumValues =
  "CreateInvoice";
export const SendDefaultInvoiceEnumValue: TTemplateProcessorEnumValues =
  "SendDefaultInvoice";
export const PaymentReminderEnumValue: TTemplateProcessorEnumValues =
  "PaymentReminder";
export const RenewLeaseNoticeEnumValue: TTemplateProcessorEnumValues =
  "RenewLeaseNotice";
export const UpdatePropertyApiRequestEnumValue: TUpdatePropertyApiRequestEnumValues =
  "update";
export const DeletePropertyApiRequestEnumValue: TUpdatePropertyApiRequestEnumValues =
  "delete";

// stripHTMLForEmailMessages ...
export const stripHTMLForEmailMessages = (htmlDocument: string) => {
  const div = document.createElement("div");
  div.innerHTML = htmlDocument;
  return div.textContent || div.innerText || "";
};

// displayNextPaymentDueDate ...
// TODO: i also want to move this to the getPropertyDetailsHook.
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
// TODO: this should also be returned from the usePropertyHook i think
export const sumCentsToDollars = (...values: number[]): number => {
  return values.reduce((total, val) => {
    return total + (isNaN(val) ? 0 : val / 100);
  }, 0);
};

// derieveTotalRent ...
// defines a function used to fetch total rent based on property, tenants and tenants w/o SoR occupancy.
// Also adds additional charges. Does NOT take late fee into account
// TODO: add this on useGetPropertyDetails hook. so that we can have the ability to re-use it. we also should attempt to move other functions to this hook as well
export const derieveTotalRent = (
  property: TProperty,
  tenants: TTenant[],
  isAnyTenantSoR: boolean,
) => {
  if (!property) return 0;
  const totalRent = property.rent + property.additionalRent;
  if (isAnyTenantSoR) {
    return tenants.reduce(
      (total: number, tenant) => total + tenant.rent + property.additionalRent,
      0,
    );
  } else {
    return totalRent;
  }
};

// getOccupancyRate ...
export const getOccupancyRate = (
  property: TProperty,
  tenants: TTenant[],
  isAnyTenantSoR: boolean,
): number => {
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

// isFeatureEnabled ...
// replace WITH isSelectedFeatureEnabled function

// export const isFeatureEnabled = (key: string):boolean => {
//   const enabledFlagMap = rootLevelEnabledFeatures();
//   return enabledFlagMap.get(key) || false;
// };

// sanitizeApiFields ...
export const sanitizeApiFields = <T extends Record<string, any>>(
  obj: T = {} as T,
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null),
  ) as Partial<T>;
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
    draft.owner = fetchUsernameFromParams(
      propertyOwnerData?.first_name,
      propertyOwnerData?.last_name,
      propertyOwnerData?.googleDisplayName,
    );
    draft.ownerEmail = property?.owner_email;
    draft.tenant = fetchUsernameFromParams(
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
      populateEndDate(primaryTenant?.start_date, primaryTenant?.term),
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
    draft.owner = fetchUsernameFromParams(
      propertyOwnerData?.first_name,
      propertyOwnerData?.last_name,
      propertyOwnerData?.googleDisplayName,
    );
    draft.dateOfExtension = dayjs().format("MM-DD-YYYY");
    draft.newExpirationDate = dayjs().add(12, "month").format("MM-DD-YYYY");
    draft.isRentChanged = property?.rent_increment > 0;
    draft.isRentNotChanged = property?.rent_increment === 0;
    draft.rentChangeAmt = property?.rent_increment;
    draft.expirationDate = dayjs().add(12, "month").format("MM-DD-YYYY");
    draft.isTenantNotVacating = true; // lease extension
    draft.isRentChanged = property?.rent_increment !== 0; // no rent increment
    draft.rentChangeAmount = property?.rent_increment;
    draft.isRentNotChanged = property?.rent_increment === 0;
    draft.isTenantVacating = true; // simulate tenant vacating for renew
    draft.endDate = dayjs(
      populateEndDate(primaryTenant?.start_date, primaryTenant?.term),
    ).format("MM-DD-YYYY");
  });

  return sanitizeApiFields(draftData);
};

// populateEndDate ...
// defines a function that returns end date based on params.
const populateEndDate = (startDate: string, lengthOfStay: number): string => {
  const lengthOfStayValue = LEASE_TERM_MENU_OPTIONS.find(
    (option) => option.value === lengthOfStay.toString(),
  );
  const endDate = dayjs(startDate).add(lengthOfStayValue?.amount, "month");
  return endDate.toISOString();
};

// fetchUsernameFromParams ...
// defines a function which returns combination of first and last name
// only uses otherName if firstName, lastName is missing.
export const fetchUsernameFromParams = (
  firstName?: string,
  lastName?: string,
  otherName?: string,
): string => {
  if (!firstName || !lastName) {
    return otherName || "N/A";
  } else if (firstName && lastName) {
    return `${firstName}, ${lastName}`;
  } else {
    return "N/A";
  }
};

// populateTooltipWithArgs ...
// defines a function which generates tooltip title with passed in values
export const populateTooltipWithArgs = (values: string[] = []) => {
  if (values.length > 0) {
    return `Missing fields - ${values.join(", ")}`;
  }
  return `No missing fields in html body`;
};
