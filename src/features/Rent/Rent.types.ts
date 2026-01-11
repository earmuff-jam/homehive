import { Dayjs } from "dayjs";

import { TGeoLocationCoordinates } from "src/types";

// TCreateInvoiceEnumValue ...
type TCreateInvoiceEnumValue = "CreateInvoice";
// TSendDefaultInvoiceEnumValue ...
type TSendDefaultInvoiceEnumValue = "SendDefaultInvoice";
// TPaymentReminderEnumValue ...
type TPaymentReminderEnumValue = "PaymentReminder";
// TRenewLeaseNoticeEnumValue ...
type TRenewLeaseNoticeEnumValue = "RenewLeaseNotice";
// TStripePaymentStatusEnum ...
type TStripePaymentStatusEnum = "paid";
// TManualPaymentStatusEnum ...
type TManualPaymentStatusEnum = "manual";
// TCompletePaymentStatusEnum ...
type TCompletePaymentStatusEnum = "complete";

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
  | TCompletePaymentStatusEnum;

// TRentDialog ...
export type TRentDialog = {
  title: string;
  type: string;
  display: boolean;
};

// TProperty ...
export type TProperty = {
  id: string;
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
  ownerEmail?: string;
  rentees?: string[]; // list of tenant emails
  location?: TGeoLocationCoordinates;
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
  createdOn: Dayjs;
  createdBy: string;
  updatedOn: Dayjs;
  updatedBy: string;
};

// TTenantForm ...
export type TTenantForm = {
  email: string;
  startDate: Dayjs;
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
export type TTenant = {
  id: string;
  propertyId: string;
  email: string;
  startDate: Dayjs;
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
  createdBy: string;
  createdOn: Dayjs;
  updatedBy: string;
  updatedOn: Dayjs;
};

// TCurrentMonthRent ...
export type TCurrentMonthRent = {
  tenantId: string;
  tenantEmail: string;
  status: TPaymentStatusEnumValues;
  rentAmount: number;
  propertyId: string;
  note: string;
  additionalCharges: number;
  createdBy: string;
  createdOn: Dayjs;
  updatedBy: string;
  updatedOn: Dayjs;
};

// TRentRecordForm ...
export type TRentRecordForm = {
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantEmail: string;
  rent: number;
  paymentMethod: string;
  rentMonth: Dayjs;
  rentPaidDate: Dayjs;
  note?: string;
  createdBy: string;
  createdOn: Dayjs;
  updatedBy: string;
  updatedOn: Dayjs;
};

// TRentRecordPayload...
export type TRentRecordPayload = {
  id: string;
  rent: number;
  additionalCharges: number;
  tenantEmail: string;
  propertyId: string;
  propertyOwnerId: string;
  tenantId: string;
  rentMonth: string;
  note?: string;
  status: string;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
};

// TStripeRentPaymentSubmissionProps ...
export type TStripeRentPaymentSubmissionProps = {
  id: string;
  stripeOwnerAccountId: string;
  stripeAccountIsActive: boolean;
  propertyId: string;
  propertyOwnerId: string;
  tenantId: string; // tenant === payee
  status: string; // the type of "intent" first step of stripe payment
  tenantRentDueDate: Dayjs;
  tenantEmail: string;
  rentAmount: number;
  rentMonth: string;
  additionalCharges: number;
  initialLateFee: number;
  dailyLateFee: number;
  createdBy: string;
  createdOn: Dayjs;
  updatedBy: string;
  updatedOn: Dayjs;
};
