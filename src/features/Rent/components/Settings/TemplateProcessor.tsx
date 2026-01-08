import dayjs from "dayjs";

import { fetchLoggedInUser, isSelectedFeatureEnabled } from "common/utils";
import { useCreateEmailMutation } from "features/Api/externalIntegrationsApi";
import {
  TProperty,
  TTemplateObject,
  TTemplateProcessorEnumValues,
  TTenant,
} from "features/Rent/Rent.types";
import { processTemplate } from "features/Rent/components/Settings/common";
import {
  CreateInvoiceEnumValue,
  PaymentReminderEnumValue,
  RenewLeaseNoticeEnumValue,
  SendDefaultInvoiceEnumValue,
  getNextMonthlyDueDate,
  stripHTMLForEmailMessages,
} from "features/Rent/utils";
import { TUserDetails } from "src/types";

// TCreateEmailTrigger ...
// defines a type for a mutation provided by rtk query
type TCreateEmailTrigger = ReturnType<typeof useCreateEmailMutation>[0];

export const handleQuickConnectAction = (
  action: TTemplateProcessorEnumValues,
  property: TProperty,
  totalRent: number,
  primaryTenant: TTenant,
  propertyOwnerDetails: TUserDetails,
  propertyOwnerCraftedTemplates: TTemplateObject,
  redirectTo: (path: string) => void,
  createEmailMutationHandler: TCreateEmailTrigger,
) => {
  const today = dayjs();
  const user = fetchLoggedInUser();

  const unit = primaryTenant?.term.endsWith("y") ? "year" : "month";
  const leaseEndDate = dayjs(primaryTenant?.startDate)
    .add(parseInt(primaryTenant?.term), unit)
    .format("MM-DD-YYYY");

  const templateVariables = {
    leaseEndDate: leaseEndDate,
    rentIncrement: property?.additionalRent,
    oneYearRentChange: property?.rent + property?.additionalRent,
    responseDeadline: today.add(1, "M").format("MM-DD-YYYY"), // add 30 days for response deadline
    ownerPhone: propertyOwnerDetails?.phone,
    ownerEmail: propertyOwnerDetails?.email,
    currentDate: today.format("MMMM DD, YYYY"),
    tenantName: primaryTenant?.email || "Rentee",
    propertyAddress: `${property.address}, ${property.city}, ${property.state} ${property.zipcode}`,
    amount: totalRent,
    dueDate: getNextMonthlyDueDate(primaryTenant.startDate),
    month: today.format("MMMM"),
    year: today.get("year"),
    ownerName: propertyOwnerDetails?.googleDisplayName,
    companyName: propertyOwnerDetails?.email || "",
    contactInfo: propertyOwnerDetails?.phone || "",
  };

  switch (action) {
    case CreateInvoiceEnumValue: {
      redirectTo("/invoice/edit");
      break;
    }

    case SendDefaultInvoiceEnumValue: {
      const invoiceSubject = processTemplate(
        propertyOwnerCraftedTemplates.invoice.subject,
        templateVariables,
      );
      const invoiceBody = processTemplate(
        propertyOwnerCraftedTemplates.invoice.body,
        templateVariables,
      );
      const invoiceHtml = processTemplate(
        propertyOwnerCraftedTemplates.invoice.html,
        templateVariables,
        user?.email,
      );
      draftAndSendEmailNotice(
        {
          to: primaryTenant.email,
          subject: invoiceSubject,
          body: invoiceBody,
          html: invoiceHtml,
        },
        createEmailMutationHandler,
      );
      break;
    }

    case PaymentReminderEnumValue: {
      const reminderSubject = processTemplate(
        propertyOwnerCraftedTemplates.reminder.subject,
        templateVariables,
      );
      const reminderBody = processTemplate(
        propertyOwnerCraftedTemplates.reminder.body,
        templateVariables,
      );
      const invoiceHtml = processTemplate(
        propertyOwnerCraftedTemplates.reminder.html,
        templateVariables,
        user?.email,
      );

      draftAndSendEmailNotice(
        {
          to: primaryTenant.email,
          subject: reminderSubject,
          body: reminderBody,
          html: invoiceHtml,
        },
        createEmailMutationHandler,
      );
      break;
    }

    case RenewLeaseNoticeEnumValue: {
      const reminderSubject = processTemplate(
        propertyOwnerCraftedTemplates.noticeOfLeaseRenewal.subject,
        templateVariables,
      );
      const reminderBody = processTemplate(
        propertyOwnerCraftedTemplates.noticeOfLeaseRenewal.body,
        templateVariables,
      );
      const reminderHtml = processTemplate(
        propertyOwnerCraftedTemplates.noticeOfLeaseRenewal.html,
        templateVariables,
        user?.email,
      );

      draftAndSendEmailNotice(
        {
          to: primaryTenant.email,
          subject: reminderSubject,
          body: reminderBody,
          html: reminderHtml,
        },
        createEmailMutationHandler,
      );
      break;
    }
  }
};

// draftAndSendEmailNotice ...
// defines a function used to create a email template and send to client
// uses OS email feature if the sendEmail feature is globally disabled
const draftAndSendEmailNotice = ({ to, subject, body, html }, sendEmail) => {
  const isEmailEnabled = isSelectedFeatureEnabled("sendEmail");

  // if client has ability to send email, use that else just use whatever is available
  if (isEmailEnabled) {
    sendEmail({
      to: to,
      subject: subject,
      text: stripHTMLForEmailMessages(body),
      html: html,
    });
  } else {
    const plainTextBody = stripHTMLForEmailMessages(body);
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(plainTextBody)}`;
    window.open(mailtoLink);
  }
};
