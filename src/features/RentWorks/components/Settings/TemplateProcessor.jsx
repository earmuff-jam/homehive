import dayjs from "dayjs";

import { EditInvoiceRouteUri } from "common/utils";
import {
  CreateInvoiceEnumValue,
  PaymentReminderEnumValue,
  RenewLeaseNoticeEnumValue,
  SendDefaultInvoiceEnumValue,
  fetchLoggedInUser,
  isFeatureEnabled,
  stripHTMLForEmailMessages,
} from "features/RentWorks/common/utils";
import { processTemplate } from "features/RentWorks/components/Settings/common";

export const handleQuickConnectAction = (
  action,
  property,
  totalRentAmount,
  monthlyRentalDueDate,
  primaryTenant,
  propertyOwner,
  templates,
  redirectTo,
  sendEmail,
) => {
  const user = fetchLoggedInUser();
  const templateVariables = {
    leaseEndDate: dayjs(), // the day the lease ends
    newSemiAnnualRent: property?.newSemiAnnualRent || "",
    oneYearRentChange: property?.onYearRentChange || "",
    responseDeadline: property?.newLeaseResponseDeadline || "",
    ownerPhone: propertyOwner?.phone,
    ownerEmail: propertyOwner?.email,
    currentDate: dayjs().format("MMMM DD, YYYY"),
    tenantName: primaryTenant?.name || "Rentee",
    propertyAddress: `${property.address}, ${property.city}, ${property.state} ${property.zipcode}`,
    amount: totalRentAmount,
    dueDate: monthlyRentalDueDate,
    month: dayjs().format("MMMM"),
    year: dayjs().get("year"),
    ownerName: propertyOwner?.googleDisplayName,
    companyName: propertyOwner?.company_name || "",
    contactInfo: propertyOwner?.email || "",
  };

  switch (action) {
    case CreateInvoiceEnumValue: {
      redirectTo(EditInvoiceRouteUri);
      break;
    }

    case SendDefaultInvoiceEnumValue: {
      const invoiceSubject = processTemplate(
        templates.invoice.subject,
        templateVariables,
      );
      const invoiceBody = processTemplate(
        templates.invoice.body,
        templateVariables,
      );
      const invoiceHtml = processTemplate(
        templates.invoice.html,
        templateVariables,
        user?.googleEmailAddress,
      );
      formatEmail(
        {
          to: primaryTenant.email,
          subject: invoiceSubject,
          body: invoiceBody,
          html: invoiceHtml,
        },
        sendEmail,
      );
      break;
    }

    case PaymentReminderEnumValue: {
      const reminderSubject = processTemplate(
        templates.reminder.subject,
        templateVariables,
      );
      const reminderBody = processTemplate(
        templates.reminder.body,
        templateVariables,
      );
      const invoiceHtml = processTemplate(
        templates.reminder.html,
        templateVariables,
        user?.googleEmailAddress,
      );

      formatEmail(
        {
          to: primaryTenant.email,
          subject: reminderSubject,
          body: reminderBody,
          html: invoiceHtml,
        },
        sendEmail,
      );
      break;
    }

    case RenewLeaseNoticeEnumValue: {
      const reminderSubject = processTemplate(
        templates.noticeOfLeaseRenewal.subject,
        templateVariables,
      );
      const reminderBody = processTemplate(
        templates.noticeOfLeaseRenewal.body,
        templateVariables,
      );
      const reminderHtml = processTemplate(
        templates.noticeOfLeaseRenewal.html,
        templateVariables,
        user?.googleEmailAddress,
      );

      formatEmail(
        {
          to: primaryTenant.email,
          subject: reminderSubject,
          body: reminderBody,
          html: reminderHtml,
        },
        sendEmail,
      );
      break;
    }
  }
};

/**
 * formatEmail ...
 *
 * function used to send email via sendEmail functionality
 * @param {Object} userInformation - object containing reciever information
 */
const formatEmail = ({ to, subject, body, html }, sendEmail) => {
  const isEmailEnabled = isFeatureEnabled("sendEmail");

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
