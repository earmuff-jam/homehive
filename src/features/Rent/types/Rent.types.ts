import { ReactNode } from "react";

import { Dayjs } from "dayjs";

import { SxProps, Theme } from "@mui/material";

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

// TTemplateProcessorEnumValues ...
export type TTemplateProcessorEnumValues =
  | TCreateInvoiceEnumValue
  | TSendDefaultInvoiceEnumValue
  | TPaymentReminderEnumValue
  | TRenewLeaseNoticeEnumValue;

// TPaymentStatusEnumValues ...
export type TPaymentStatusEnumValues =
  | TStripePaymentStatusEnum
  | TManualPaymentStatusEnum;

// TRentRowHeader ...
export type TRentRowHeader = {
  title: string;
  caption?: string | ReactNode;
  showDate?: boolean;
  createdDate?: Dayjs;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
};

// TRentDialog ...
export type TRentDialog = {
  title: string;
  type: string;
  display: boolean;
};

// TPropertyLocation ...
export type TPropertyLocation = {
  lat: string;
  lon: string;
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
  location: TPropertyLocation;
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
