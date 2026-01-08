import { ReactElement, ReactNode } from "react";

import { ChipProps } from "@mui/material";
import {
  TAuditColumns,
  TGeoLocationCoordinates,
  TUserDetails,
} from "src/types";

// TCreateInvoiceEnumValue ...
type TCreateInvoiceEnumValue = "CreateInvoice";
// TSendDefaultInvoiceEnumValue ...
type TSendDefaultInvoiceEnumValue = "SendDefaultInvoice";
// TPaymentReminderEnumValue ...
type TPaymentReminderEnumValue = "PaymentReminder";
// TRenewLeaseNoticeEnumValue ...
type TRenewLeaseNoticeEnumValue = "RenewLeaseNotice";
// TStripePaymentIntentStatusEnum ...
export type TStripePaymentIntentStatusEnum = "intent";
// TStripePaymentStatusEnum ...
export type TStripePaymentStatusEnum = "paid";
// TManualPaymentStatusEnum ...
export type TManualPaymentStatusEnum = "manual";
// TCompletePaymentStatusEnum ...
export type TCompletePaymentStatusEnum = "complete";
// TExternalIntegrationKey ...
export type TExternalIntegrationKey = "stripe" | "esign";
// TUpdatePropertyApiRequestEnumValue ...
type TUpdatePropertyApiRequestEnumValue = "update";
// TDeletePropertyApiRequestEnumValue ...
type TDeletePropertyApiRequestEnumValue = "delete";
// TStripeUserStatusSuccessType ...
export type TStripeUserStatusSuccessType = "success";
// TStripeUserStatusSuccessLabel ...
export type TStripeUserStatusSuccessLabel = "Success";
// TStripeUserStatusSuccessMessage ...
export type TStripeUserStatusSuccessMessage =
  "Stripe Account is connected and ready";
// TStripeUserStatusFailureType ...
export type TStripeUserStatusFailureType = "error";
// TStripeUserStatusFailureLabel ...
export type TStripeUserStatusFailureLabel = "Failed";
// TStripeUserStatusFailureMessage ...
export type TStripeUserStatusFailureMessage =
  "Stripe account setup is incomplete.";

// TTemplateProcessorEnumValues ...
export type TTemplateProcessorEnumValues =
  | TCreateInvoiceEnumValue
  | TSendDefaultInvoiceEnumValue
  | TPaymentReminderEnumValue
  | TRenewLeaseNoticeEnumValue;

// TPaymentStatusEnumValues ...
export type TPaymentStatusEnumValues =
  | TStripePaymentStatusEnum
  | TManualPaymentStatusEnum
  | TStripePaymentIntentStatusEnum
  | TCompletePaymentStatusEnum;

// UpdatePropertyApiRequestParam ...
export type TUpdatePropertyApiRequestEnumValues =
  | TUpdatePropertyApiRequestEnumValue
  | TDeletePropertyApiRequestEnumValue;

// TStripeUserStatusTypeEnumValues ...
export type TStripeUserStatusTypeEnumValues =
  | TStripeUserStatusSuccessType
  | TStripeUserStatusFailureType;

// TStripeUserStatusLabelEnumValues ...
export type TStripeUserStatusLabelEnumValues =
  | TStripeUserStatusSuccessLabel
  | TStripeUserStatusFailureLabel;

// TStripeUserStatusMessageEnumValues ...
export type TStripeUserStatusMessageEnumValues =
  | TStripeUserStatusSuccessMessage
  | TStripeUserStatusFailureMessage;

// TStripeAlert ...
export type TStripeAlert = {
  type: TStripeUserStatusTypeEnumValues;
  label: TStripeUserStatusLabelEnumValues;
  message: TStripeUserStatusMessageEnumValues;
  reasons?: string[];
};

// TRentDialog ...
export type TRentDialog = {
  title: string;
  type: string;
  display: boolean;
};

// TPropertyForm
export type TPropertyForm = {
  name: string;
  address: string;
  county: string;
  city: string;
  state: string;
  zipcode: string;
  units: number;
  bathrooms: number;
  sqFt: number;
  note?: string;
  ownerEmail: string;
  emergencyContactNumber: string;
  isTenantCleaningYard: boolean;
  isSmoking: boolean;
  isOwnerCoveredUtilities: boolean;
  ownerCoveredUtilities: string;
  rent: number;
  additionalRent: number;
  rentIncrement: number;
  securityDeposit: number;
  allowedVehicleCounts: number;
  paymentID: string;
  specialProvisions?: string;
  isHoa: boolean;
  hoaDetails?: string;
  isBrokerManaged: boolean;
  brokerName?: string;
  brokerAddress?: string;
  isManagerManaged: boolean;
  managerName?: string;
  managerPhone?: string;
  managerAddress?: string;
};

// TProperty ...
export type TProperty = TAuditColumns &
  TPropertyForm & {
    id: string;
    isDeleted?: boolean; // represents a removed property
    rentees?: string[]; // list of tenant emails
    location?: TGeoLocationCoordinates;
  };

// TPropertyDeletePartial ...
// defines a type for handling delete
export type TPropertyDeletePartial = Partial<TProperty> & {
  id: string;
  updatedOn: string;
  updatedBy: string;
};

// TPropertyUpdateApiRequest ...
// defines a type for deleting or updating a property
// action defines either the delete or update param
export type TPropertyUpdateApiRequest = {
  property: TPropertyDeletePartial | TProperty;
  action: string;
};

// TTenantForm ...
export type TTenantForm = {
  email: string;
  startDate: string;
  term: string;
  taxRate: number;
  rent: number;
  initialLateFee: number;
  dailyLateFee: number;
  initialAnimalVoilationFee: number;
  dailyAnimalVoilationFee: number;
  returnedPaymentFee: number;
  gracePeriod: number;
  isAutoRenewPolicySet: boolean;
  autoRenewDays: number;
  isPrimary: boolean;
  isSoR: boolean;
  assignedRoomName?: string; // if SoR assignedRoomName is removed
  guestsPermittedStayDays: number;
  tripCharge: number;
  allowKeyboxSince: number;
  removeKeyboxFee: number;
  inventoryCompleteWithin: number;
  rentDueDate: number; // how many days the rent can be delayed from due date
  isActive: boolean;
};

// TTenant ...
export type TTenant = TAuditColumns & {
  id: string;
  propertyId: string;
  email: string;
  startDate: string;
  term: string;
  taxRate: number;
  rent: number;
  initialLateFee: number;
  dailyLateFee: number;
  initialAnimalVoilationFee: number;
  dailyAnimalVoilationFee: number;
  returnedPaymentFee: number;
  gracePeriod: number;
  isAutoRenewPolicySet: boolean;
  autoRenewDays: number;
  isPrimary: boolean;
  isSoR: boolean;
  assignedRoomName?: string; // if SoR assignedRoomName is removed
  guestsPermittedStayDays: number;
  tripCharge: number;
  allowKeyboxSince: number;
  removeKeyboxFee: number;
  inventoryCompleteWithin: number;
  rentDueDate: number;
  isActive: boolean;
};

// TDocumentRow ...
export type TDocumentRow = {
  id: string;
  fileName: string;
  updatedOn: string;
};

// TRentRecordForm ...
export type TRentRecordForm = TAuditColumns & {
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantEmail: string;
  rent: number;
  paymentMethod: string;
  rentMonth: string;
  rentPaidDate: string;
  note?: string;
};

// TRentRecordPayload...
// defines a type used for all rent records and api payloads
export type TRentRecordPayload = TAuditColumns & {
  id: string;
  rent: number;
  additionalCharges: number;
  tenantEmail: string;
  propertyId: string;
  propertyOwnerId: string;
  tenantId: string;
  rentMonth: string;
  note?: string;
  status: TPaymentStatusEnumValues;
};

//  TTemplate ...
export type TTemplate = {
  label: string;
  title: string;
  icon?: ReactNode;
  caption: string;
  subject: string;
  body: string;
  fieldsToUse: string[];
  html: string;
};

// TInvoiceTemplateEnumValue ...
export type TInvoiceTemplateEnumValue = "invoice";
// TReminderTemplateEnumValue ...
export type TReminderTemplateEnumValue = "reminder";
// TRentTemplateEnumValue ...
export type TRentTemplateEnumValue = "rent";
// TNoticeOfLeaseRenewalEnumValue ...
export type TNoticeOfLeaseRenewalEnumValue = "noticeOfLeaseRenewal";
// TTemplateObjectKeyEnumValues ...
export type TTemplateObjectKeyEnumValues =
  | TInvoiceTemplateEnumValue
  | TReminderTemplateEnumValue
  | TRentTemplateEnumValue
  | TNoticeOfLeaseRenewalEnumValue;

// TTemplateObject ...
// defines a type for rent quick actions
export type TTemplateObject = {
  invoice: TTemplate;
  reminder: TTemplate;
  rent: TTemplate;
  noticeOfLeaseRenewal: TTemplate;
};

// TTemplateForm ...
export type TTemplateForm = {
  subject: string;
  body: string;
  html: string;
};

// TTabConfig ...
export type TTabConfig = {
  label: string;
  icon: ReactElement;
  content: ReactElement;
};

// TUseGetPropertyDetailsResponse ...
export type TUseGetPropertyDetailsResponse = {
  color: ChipProps["color"];
  label: string;
  totalRent: number;
  occupancyRate: number;
  icon: ReactElement;
};

// TQuickConnectMenuItem ...
export type TQuickConnectMenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
  action: TTemplateProcessorEnumValues;
};

// TOptionSubMenuOption ...
export type TOptionSubMenuOption = {
  label: string;
  title: TExternalIntegrationKey;
  icon: ReactElement;
  content: ReactElement;
};

// TQuickConnectActionProps ...
export type TQuickConnectActionProps = {
  action: TTemplateProcessorEnumValues;
  property: TProperty;
  totalRent: number;
  primaryTenant: TTenant;
  propertyOwnerDetails: TUserDetails;
  propertyOwnerCraftedTemplates: TTemplateObject;
  redirectTo: (path: string) => void;
  createEmailMutationHandler: string;
};
