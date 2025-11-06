import React from "react";

import {
  AssignmentLateRounded,
  CircleNotificationsRounded,
  LoopRounded,
  ReceiptRounded,
} from "@mui/icons-material";

/**
 * DefaultTemplateData ...
 *
 * used to create default email templates to send to the client directly.
 */
export const DefaultTemplateData = {
  invoice: {
    label: "Invoice Template",
    title: "invoice",
    icon: <ReceiptRounded fontSize="small" />,
    caption: "Customize professional rent invoices",
    subject: "Monthly Rent Invoice - {{propertyAddress}}",
    body: "Please view your invoice details below",
    fieldsToUse: [
      "currentDate",
      "tenantName",
      "propertyAddress",
      "month",
      "year",
      "amount",
      "dueDate",
      "ownerName",
    ],
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>{{currentDate}}</p>

  <p>
    To<br />
    <strong>{{tenantName}}</strong><br />
    {{propertyAddress}}
  </p>

  <p>Dear {{tenantName}},</p>

  <p>Please find attached your rent invoice for <strong>{{month}} {{year}}</strong>.</p>

  <p>
    <strong>Property:</strong> {{propertyAddress}}<br />
    <strong>Amount Due:</strong> $ {{amount}}<br />
    <strong>Due Date:</strong> {{dueDate}}
  </p>

  <p>
    Best regards,<br />
    <strong>{{ownerName}}</strong><br />
    {{propertyAddress}}
  </p>
</div>
    `,
  },
  reminder: {
    label: "Rent Late Payment Reminder Template",
    title: "reminder",
    icon: <AssignmentLateRounded fontSize="small" />,
    caption: "Customize friendly reminders for overdue rent payments",
    subject: "Rent Late Payment Reminder - {{propertyAddress}}",
    body: "Please view your late payment reminder",
    fieldsToUse: [
      "currentDate",
      "tenantName",
      "propertyAddress",
      "month",
      "year",
      "amount",
      "dueDate",
      "ownerName",
    ],
    html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>{{currentDate}}</p>

  <p>
    To<br />
    <strong>{{tenantName}}</strong><br />
    <strong>{{propertyAddress}}</strong>
  </p>

  <p>Dear <strong>{{tenantName}}</strong>,</p>

  <p>
    This is a friendly reminder that your rent payment of 
    <strong>$ {{amount}}</strong> was due on <strong>{{dueDate}}</strong>.
  </p>

  <p><strong>Property:</strong> {{propertyAddress}}</p>

  <p>
    Please submit your payment on time to avoid any late fees.
  </p>

  <p>
    Best regards,<br />
    <strong>{{ownerName}}</strong><br />
    {{propertyAddress}}
  </p>
</div>
`,
  },
  rent: {
    label: "Rent Regular Payment Reminder Template",
    icon: <CircleNotificationsRounded fontSize="small" />,
    caption: "Customize payment reminder form",
    subject: "Rent Payment Reminder - {{propertyAddress}}",
    body: "Please view your regular rent payment reminder",
    fieldsToUse: [
      "currentDate",
      "tenantName",
      "propertyAddress",
      "month",
      "year",
      "amount",
      "dueDate",
      "ownerName",
    ],
    html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>{{currentDate}}</p>

  <p>
    To<br />
    <strong>{{tenantName}}</strong><br />
    <strong>{{propertyAddress}}</strong>
  </p>

  <p>Dear <strong>{{tenantName}}</strong>,</p>

  <p>
    This is a friendly reminder that your rent payment of 
    <strong>$ {{amount}}</strong> is due on <strong>{{dueDate}}</strong>.
  </p>

  <p><strong>Property:</strong> {{propertyAddress}}</p>

  <p>
    Please submit your payment on time to avoid any late fees.
  </p>

  <p>
    Best regards,<br />
    <strong>{{ownerName}}</strong><br />
    {{propertyAddress}}
  </p>
</div>
`,
  },
  noticeOfLeaseRenewal: {
    label: "Notice of Lease Renewal Template",
    title: "noticeOfLeaseRenewal",
    icon: <LoopRounded fontSize="small" />,
    caption: "Customize automatic lease renewal and expiration notices",
    subject: "Notice of Lease Expiration and Renewal - {{propertyAddress}}",
    body: "Please view your notice of renewal",
    fieldsToUse: [
      "currentDate",
      "tenantName",
      "propertyAddress",
      "month",
      "year",
      "amount",
      "dueDate",
      "ownerName",
      "ownerPhone",
      "ownerEmail",
      "leaseEndDate",
      "rentIncrement",
      "oneYearRentChange",
      "responseDeadline",
    ],
    html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>{{currentDate}}</p>

  <p style="font-weight: bold;">
    To<br />
    {{tenantName}}<br />
    {{propertyAddress}}
  </p>

  <strong><p> Subject - Notice of lease expiration and renewal </p></strong>

  <p>Dear {{tenantName}},</p>

  <p>
    This letter is being sent to inform you that your current lease at 
    <strong>{{propertyAddress}}</strong> is, as you may be aware, set to expire on 
    <strong>{{leaseEndDate}}</strong>.
  </p>

  <p>Please review the following renewal options, as stipulated in your existing lease agreement:</p>

  <p>
  We have greatly appreciated having you as a tenant, and we would like to extend the opportunity
for you to continue your tenancy at our property. In accordance with the terms of your current
lease agreement, we are providing you with this notice 60 days in advance to discuss the renewal
options.
</p>

  <p>
    <strong>• SEMI ANNUAL LEASE RENEWAL:</strong><br />
    If you choose to switch to a semi-annual lease, please be advised that the monthly rent will increase by 
    {{ rentIncrement }} US Dollars only. This option provides flexibility but comes with a higher monthly cost.
  </p>

  <p style="font-weight: bold;">
    • ONE YEAR LEASE RENEWAL:<br />
    Opting for a one-year lease renewal will result in the following change:
    {{oneYearRentChange}}. This fixed-term option offers stability and predictability for the upcoming year.
  </p>

  <p>
    Please carefully consider the above-mentioned terms and inform us of your decision by 
    <strong>{{responseDeadline}}</strong>. You can contact us at <strong>{{ownerPhone}}</strong> or via email at 
    <strong>{{ownerEmail}}</strong> for any further queries.
  </p>

  <p style="font-weight: bold;">
    Please be advised that all other terms of your original rental agreement remain in effect.<br />
    We value your tenancy and look forward to continuing our positive landlord-tenant relationship.
  </p>

  <p>
    Regards,<br />
    <strong>{{ownerName}}</strong><br />
    <strong>{{propertyAddress}}</strong><br />
  </p>
</div>
`,
  },
};
