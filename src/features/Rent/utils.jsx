import React from "react";

/**
 * Utility file for properties
 */
import dayjs from "dayjs";

import {
  AssignmentLateRounded,
  MoneyOffRounded,
  PaidRounded,
} from "@mui/icons-material";
import { authorizedServerLevelFeatureFlags } from "common/ApplicationConfig";
import { DefaultLeaseTermOptions } from "features/Rent/common/constants";
import { produce } from "immer";

// stripe rent status
export const PaidRentStatusEnumValue = "paid";
export const ManualRentStatusEnumValue = "manual";

export const CreateInvoiceEnumValue = "Create_Invoice";
export const SendDefaultInvoiceEnumValue = "Send_Default_Invoice";
export const PaymentReminderEnumValue = "Payment_Reminder";
export const RenewLeaseNoticeEnumValue = "Renew_Lease_Notice_Enum_Value";

// stripHTMLForEmailMessages ...
// defines a fuction that returns email messages that are stripped from its html contents
export const stripHTMLForEmailMessages = (htmlDocument) => {
  const div = document.createElement("div");
  div.innerHTML = htmlDocument;
  return div.textContent || div.innerText || "";
};

// formatCurrency ...
// defines a function that formats a currency to a string value
export const formatCurrency = (amt = 0) => {
  return amt.toFixed(2);
};

// sumCentsToDollars ...
// defines a function that converts cents into dollars
export const sumCentsToDollars = (...values) => {
  return values.reduce((total, val) => {
    const num = Number(val || 0);
    return total + (isNaN(num) ? 0 : num / 100);
  }, 0);
};

// getOccupancyRate ...
// defines a function that returns the occupancy rate for each home
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

// getColorAndLabelForCurrentMonth ...
// defines a function that returns a specific color and label based on params and gracePeriod
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

// getRentStatus ...
// this also feels like similar to color and label
export function getRentStatus({ isPaid, isLate }) {
  if (isPaid) return { color: "success", label: "Paid" };
  if (isLate) return { color: "error", label: "Overdue" };
  return { color: "warning", label: "Unpaid" };
}

// getRentDetails ...
// feels like this is same as totalRent
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

// isAssociatedPropertySoR ...
export const isAssociatedPropertySoR = (property, tenants) => {
  if (tenants?.length <= 0) return true;
  return (
    property?.rentees?.length > 0 &&
    tenants.some((tenant) => tenant.isActive && tenant.isSoR)
  );
};

// buildPaymentLineItems ...
// defines a function that builds payment line items for each invoice
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
        value: Number(property?.additionalRent) || 0,
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

// isFeatureEnabled ...
export const isFeatureEnabled = (key) => {
  const enabledFlagMap = authorizedServerLevelFeatureFlags();
  return enabledFlagMap.get(key) || false;
};

// sanitizeApiFields ...
// defines a function that removes all null or undefined values from an object for external integration
export const sanitizeApiFields = (obj = {}) =>
  /* eslint-disable no-unused-vars */
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null));

// sanitizeEsignFieldsForNewLease ...
// defines a function that populates correct fields for esign purposes
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
      propertyOwnerData?.firstName,
      propertyOwnerData?.lastName,
      propertyOwnerData?.googleDisplayName,
    );
    draft.ownerEmail = property?.email;
    draft.tenant = validateFullName(
      tenantData?.firstName,
      tenantData?.lastName,
      tenantData?.googleDisplayName || primaryTenant.email,
    );
    draft.tenantEmail = primaryTenant.email;
    draft.address = property?.address;
    draft.city = property?.city;
    draft.state = property?.state;
    draft.zipCode = property?.zipCode;
    draft.county = property?.county;
    draft.startDate = dayjs(primaryTenant?.startDate).format("MM-DD-YYYY");
    draft.endDate = dayjs(
      derieveEndDate(primaryTenant?.startDate, primaryTenant?.term),
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

// sanitizeEsignFieldsForLeaseExtension ...
// defines a function that sanitizes and populates correct fields for esign purposes
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
      propertyOwnerData?.firstName,
      propertyOwnerData?.lastName,
      propertyOwnerData?.googleDisplayName,
    );
    draft.dateOfExtension = dayjs().format("MM-DD-YYYY");
    draft.newExpirationDate = dayjs().add("12", "month").format("MM-DD-YYYY");
    draft.isRentChanged = property?.rentIncrement > 0;
    draft.isRentNotChanged = property?.rentIncrement === 0;
    draft.rentChangeAmt = property?.rentIncrement;
    draft.expirationDate = dayjs().add("12", "month").format("MM-DD-YYYY");
    draft.isTenantNotVacating = true; // lease extension
    draft.isRentChanged = property?.rentIncrement !== 0; // no rent increment
    draft.rentChangeAmount = property?.rentIncrement;
    draft.isRentNotChanged = property?.rentIncrement === 0;
    draft.isTenantVacating = true; // simulate tenant vacating for renew
    draft.endDate = dayjs(
      derieveEndDate(primaryTenant?.startDate, primaryTenant?.term),
    ).format("MM-DD-YYYY");
  });

  return sanitizeApiFields(draftData);
};

// derieveEndDate ...
// defines a function that calculates the end date based on params
const derieveEndDate = (startDate, lengthOfStay) => {
  const lengthOfStayValue = DefaultLeaseTermOptions.find(
    (option) => option.value === lengthOfStay,
  );
  const endDate = dayjs(startDate).add(lengthOfStayValue?.amount, "month");
  return endDate.toISOString();
};

// validateFullName ...
// defines a function that returns valid user name if found, default "N/A"
const validateFullName = (firstName, lastName, otherName) => {
  if (!firstName || !lastName) {
    return otherName || "N/A";
  } else if (firstName && lastName) {
    return `${firstName}, ${lastName}`;
  } else {
    return "N/A";
  }
};
