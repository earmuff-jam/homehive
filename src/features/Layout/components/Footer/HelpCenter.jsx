import React from "react";

import {
  ArchitectureRounded,
  EmailRounded,
  HelpRounded,
  HomeRounded,
  ReceiptRounded,
  SaveAltRounded,
} from "@mui/icons-material";
import FaqDetails from "common/FaqDetails";

const faqItems = [
  {
    icon: <HomeRounded fontSize="small" />,
    q: "How do I get started with HomeHive?",
    ans: "Click on 'Get Started' or 'See How It Works' to begin. We recommend starting with a single property to familiarize yourself with the platform. You can also explore the Invoicer tool without creating a full account.",
  },
  {
    icon: <SaveAltRounded fontSize="small" />,
    q: "What does HomeHive offer?",
    ans: "HomeHive is a suite of tools designed for property and financial management. It includes Rent Management (tenants, leases, and notifications), Invoicer (invoices, payments, and templates), and Esign (secure document signing with audit trails).",
  },
  {
    icon: <HomeRounded fontSize="small" />,
    q: "What features are included in the Rent application?",
    ans: "The Rent application allows you to manage properties, tenants, and leases in one place. It includes rent tracking, automated reminders, maintenance scheduling, and tenant communication tools.",
  },
  {
    icon: <ReceiptRounded fontSize="small" />,
    q: "What features are included in the Invoicer application?",
    ans: "Invoicer helps you create, customize, and send invoices with ease. It supports recurring invoices, payment tracking, template management, and integration with online payment systems like Stripe for seamless transactions.",
  },
  {
    icon: <ArchitectureRounded fontSize="small" />,
    q: "What features are included in the Esign application?",
    ans: "Esign allows you to securely send and sign documents digitally. It includes signature fields, document tracking, audit history, and secure verification to ensure legally compliant signing workflows.",
  },
  {
    icon: <EmailRounded fontSize="small" />,
    q: "Do you store or sell my data?",
    ans: "We securely store your data to provide core application functionality such as property management, invoicing, and document tracking. We do not sell your personal information or user data to third parties.",
  },
  {
    icon: <HelpRounded fontSize="small" />,
    q: "Is there a user guide or documentation available?",
    ans: "Yes. Each section of the platform includes contextual help. You can access guides by clicking the help icon (?) in the top-right corner of the application, where available documentation and walkthroughs are provided.",
  },
];

export default function HelpCenter() {
  return <FaqDetails data={faqItems} />;
}
