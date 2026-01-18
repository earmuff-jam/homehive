import { Dayjs } from "dayjs";

import { TPaymentStatusEnumValues } from "features/Rent/Rent.types";

// TCreateStripeAccountResponse ...
export type TCreateStripeAccountResponse = {
  accountId: string;
};

// TCreateStripeAccountLinkRequest ...
export type TCreateStripeAccountLinkRequest = {
  accountId: string;
};

// TEsignFromTemplatePayload ...
// TODO: this is the same payload to send Esign document
// update it after we fix that.
export type TEsignFromTemplatePayload = Record<string, unknown>;

// TCreateEmailPayload ...
export type TCreateEmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

// TStripeRentPaymentSubmissionRequest ...
export type TStripeRentPaymentSubmissionRequest = {
  id: string;
  stripeOwnerAccountId: string;
  stripeAccountIsActive: boolean;
  propertyId: string;
  propertyOwnerId: string;
  tenantId: string; // tenant === payee
  status: TPaymentStatusEnumValues;
  tenantRentDueDate: Dayjs;
  tenantEmail: string;
  rent: number;
  rentMonth: string;
  additionalCharges: number;
  initialLateFee: number;
  dailyLateFee: number;
  createdBy: string;
  createdOn: Dayjs;
  updatedBy: string;
  updatedOn: Dayjs;
};

// TCreateWorkspaceRequest ...
export type TCreateWorkspaceRequest = {
  workspaceId: string;
};

// TCheckStripeAccountStatusRequest ...
export type TCheckStripeAccountStatusRequest = {
  accountId: string;
};

// TCreateWorkspaceResponse ...
export type TCreateWorkspaceResponse = {
  name: string;
  createdAt: Dayjs;
};
