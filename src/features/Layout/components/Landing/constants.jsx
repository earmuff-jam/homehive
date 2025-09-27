import React from "react";

import {
  AccessTime,
  CloudDownload,
  ReceiptLong,
  SecurityRounded,
} from "@mui/icons-material";

/**
 * Authorized Roles
 *
 * Owner - the person who owns the property
 * Tenant - the person who is renting the property
 */
export const OwnerRole = "Owner";
export const TenantRole = "Tenant";

/**
 * Landing Page Details ...
 *
 */
export const LANDING_PAGE_DETAILS = {
  features: [
    {
      icon: <ReceiptLong color="primary" sx={{ fontSize: 40 }} />,
      title: "Simple Workflow Creation",
      description:
        "Learn rental workflow in seconds with our intuitive interface.",
    },
    {
      icon: <SecurityRounded color="primary" sx={{ fontSize: 40 }} />,
      title: "Secure User Data",
      description: "Keep your personal information secure and private.",
    },
    {
      icon: <AccessTime color="primary" sx={{ fontSize: 40 }} />,
      title: "Time-Saving Templates",
      description: "Save previously used templates to save hours.",
    },
    {
      icon: <CloudDownload color="primary" sx={{ fontSize: 40 }} />,
      title: "Easy Exports",
      description:
        "Export invoices in multiple formats for accounting and record keeping.",
    },
  ],
  howItWorks: [
    {
      title: "One click sign up",
      description: "Easy one click to allow users to login.",
    },
    {
      title: "Set up your profile",
      description: "Add your personal information and save it for future use.",
    },
    {
      title: "Setup rental workflow",
      description: "Use our intuitive editor to create rental workflows",
    },
    {
      title: "Setup payments",
      description: "Setup payments and see your rental money flow.",
    },
  ],
  testimonials: [
    {
      quote:
        "This rental app has transformed how I manage my business. I save hours every week on rental tasks.",
      author: "Sarah J., Client, Rental provider.",
    },
    {
      quote:
        "The simplicity of this app is its greatest strength. I was able to accept payment from my first customer within minutes.",
      author: "Mark T., Consultant, Rental Provider.",
    },
    {
      quote:
        "After trying several rental solutions, this is the only one that perfectly balances features with ease of use. Love that our landlord uses this",
      author: "Elena M., Customer, Client.",
    },
  ],
};
