import React from "react";

import dayjs from "dayjs";

import {
  AssignmentLateRounded,
  BubbleChartOutlined,
  PaidRounded,
} from "@mui/icons-material";
import { authorizedServerLevelFeatureFlags } from "common/ApplicationConfig";
import { DefaultLeaseTermOptions } from "features/Rent/common/constants";
import { produce } from "immer";

export const PaidRentStatusEnumValue = "paid";
export const ManualRentStatusEnumValue = "manual";

export const CreateInvoiceEnumValue = "CreateInvoice";
export const SendDefaultInvoiceEnumValue = "SendDefaultInvoice";
export const PaymentReminderEnumValue = "PaymentReminder";
export const RenewLeaseNoticeEnumValue = "RenewLeaseNoticeEnumValue";
export const RemoveTenantNotificationEnumValue = "Notice of Removal";
export const AddTenantNotificationEnumValue = "Notice of Addition";
export const AddRentPaymentNotificationEnumValue = "Notice of Rent Payment";

export const AddNotificationEnumType = "AddNotification";
export const RemoveNotificationEnumType = "RemoveNotification";

export const EmailNotificationDisclaimer =
  "You are being notified either since you are the property owner, tenant or anyone tasked with such responsibility.";

// stripHTMLForEmailMessages ...
// defines a fuction that returns email messages that are stripped from its html contents
export const stripHTMLForEmailMessages = (htmlDocument) => {
  const div = document.createElement("div");
  div.innerHTML = htmlDocument;
  return div.textContent || div.innerText || "";
};

// appendDisclaimer ...
// defines a function that is used to append disclaimer to the parent string
export const appendDisclaimer = (parent, senderEmail) => {
  if (typeof parent !== "string") {
    console.debug("Invalid parameter passed, Skipping appendDisclaimer...");
    return parent;
  }
  return parent.concat(`
      <div>
        <p>
          <em>
            This email was sent as a result of an action performed by ${senderEmail}. Please do not reply to this email as this is an auto generated email.
          </em>
        </p>
      </div>
`);
};

// formatCurrency ...
// defines a function that formats a currency to a string value
export const formatCurrency = (amt = 0) => {
  return amt.toFixed(2);
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

// formatAndSendNotification ...
// defines a function that sends email notification to array of users based on params
export const formatAndSendNotification = ({
  to,
  subject = "",
  body = "",
  html = "",
  ccEmailIds = [],
  bccEmailIds = [],
  sendEmail,
}) => {
  const isDevEnv = isFeatureEnabled("devEnv");
  const isEmailEnabled = isFeatureEnabled("sendEmail");

  if (isEmailEnabled) {
    switch (isDevEnv) {
      // dev workflow
      case true:
        console.debug(
          `Sending email. Email enabled: ${isEmailEnabled}, Env dev: ${isDevEnv}`,
        );
        console.debug(
          `Valid email params: To: ${to}, Subject: ${subject}, Text: ${stripHTMLForEmailMessages(body)}, HTML: ${html} emailList: ${[to, ...ccEmailIds, ...bccEmailIds]}`,
        );
        break;

      // prod / test workflow
      case false:
        console.debug(
          `Sending email. Email enabled: ${isEmailEnabled}, Env dev: ${isDevEnv}`,
        );
        sendEmail({
          to: to,
          subject: subject,
          text: stripHTMLForEmailMessages(body),
          html: html,
          ccEmailIds,
          bccEmailIds,
        });
        break;

      default:
        console.debug(
          `Unable to send email. Email enabled: ${isEmailEnabled}, Env dev: ${isDevEnv}`,
        );
        break;
    }
  }
};

const noActionToPerformStr =
  "<b>There is no action for you to take at this time. If this seems unfamiliar or suspicious please reach out to your administrator.</b>";

// emailMessageBuilder ...
// defines a function that appends email message with extra disclaimer
export const emailMessageBuilder = (msgType, propertyName) => {
  switch (msgType) {
    case AddNotificationEnumType:
      return `
    Hello there, 
      This notification is to alert you that you have been added to the property listed as ${propertyName}.

      ${EmailNotificationDisclaimer}
      ${noActionToPerformStr}

    With Regards,
    Earmuffjam LLC
  `;
    case RemoveNotificationEnumType:
      return `
  Hello there,
    This notification is to alert you that you have been removed from the role of tenant from the property listed as ${propertyName}. 
  
    ${EmailNotificationDisclaimer}
    ${noActionToPerformStr}
  
  With Regards,
  Earmuffjam LLC
`;
    case AddRentPaymentNotificationEnumValue:
      return `
    Hello there,
      This notification is to alert you that rental payment has been made manually for the property listed as ${propertyName}.
    
      ${EmailNotificationDisclaimer}
      ${noActionToPerformStr}
    
    With Regards,
    Earmuffjam LLC
`;

    default:
      return `
    Hello there,
      This notification is to alert you that changes have been made to an assigned property listed as ${propertyName}. 

      ${EmailNotificationDisclaimer}
      ${noActionToPerformStr}
   
    With Regards,
    Earmuffjam LLC
`;
  }
};

// getColorAndLabelForCurrentMonth ...
// defines a function that returns a specific color and label based on params and gracePeriod
// if rent is paid, returns a success
// if rent is past grace period, returns a error
// if rent is pre-grace period,
// ignore first month since the tenant is not staying just yet, return a secondary label
export const getColorAndLabelForCurrentMonth = (
  startDate,
  rent,
  gracePeriod = 3,
) => {
  const isFirstMonthRenting = dayjs(startDate).isSame(dayjs(), "month");
  const formattedGracePeriodInDateTime = dayjs()
    .startOf("month")
    .add(gracePeriod, "day");
  const unitOfMeasurement = isFirstMonthRenting ? "month" : "day";
  const isPastGracePeriod = dayjs().isAfter(
    formattedGracePeriodInDateTime,
    unitOfMeasurement,
  );
  if (
    [PaidRentStatusEnumValue, ManualRentStatusEnumValue].includes(
      rent?.status.toLowerCase(),
    )
  ) {
    return { color: "success", label: "Paid", icon: <PaidRounded /> };
  }
  if (isPastGracePeriod) {
    return {
      color: "error",
      label: "Past due",
      icon: <AssignmentLateRounded />,
    };
  } else {
    return {
      color: "secondary",
      label: "Grace Period",
      icon: <BubbleChartOutlined />,
    };
  }
};

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
