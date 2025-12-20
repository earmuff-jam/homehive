import dayjs from "dayjs";

import { processTemplate } from "features/Rent/components/Settings/common";
import {
  CreateInvoiceEnumValue,
  PaymentReminderEnumValue,
  RenewLeaseNoticeEnumValue,
  SendDefaultInvoiceEnumValue,
  fetchLoggedInUser,
  isFeatureEnabled,
  stripHTMLForEmailMessages,
} from "features/Rent/utils";

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
  const today = dayjs();
  const user = fetchLoggedInUser();

  const unit = primaryTenant?.term.endsWith("y") ? "year" : "month";
  const leaseEndDate = dayjs(primaryTenant?.start_date)
    .add(parseInt(primaryTenant?.term), unit)
    .format("MM-DD-YYYY");

  const templateVariables = {
    leaseEndDate: leaseEndDate,
    rentIncrement: Number(property?.rent_increment) || 0,
    oneYearRentChange:
      Number(property?.rent || 0) + Number(property?.rent_increment || 0),
    responseDeadline: today.add(1, "M").format("MM-DD-YYYY"), // add 30 days for response deadline
    ownerPhone: propertyOwner?.phone,
    ownerEmail: propertyOwner?.email,
    currentDate: today.format("MMMM DD, YYYY"),
    tenantName: primaryTenant?.name || "Rentee",
    propertyAddress: `${property.address}, ${property.city}, ${property.state} ${property.zipcode}`,
    amount: totalRentAmount,
    dueDate: monthlyRentalDueDate,
    month: today.format("MMMM"),
    year: today.get("year"),
    ownerName: propertyOwner?.googleDisplayName,
    companyName: propertyOwner?.company_name || "",
    contactInfo: propertyOwner?.email || "",
  };

  switch (action) {
    case CreateInvoiceEnumValue: {
      redirectTo("/invoice/edit");
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
        user?.email,
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
        user?.email,
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
        user?.email,
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
