import { ReactElement, ReactNode } from "react";

import { ChipProps } from "@mui/material";
import { TProperty, TTenant } from "features/Rent/Rent.schema";
import { TUserDetails } from "src/types";

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

// TDocumentRow ...
export type TDocumentRow = {
  id: string;
  fileName: string;
  updatedOn: string;
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
