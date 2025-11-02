import React from "react";

import {
  HelpRounded,
  PrintOutlined,
  ReceiptLongRounded,
  SaveAltRounded,
  SendRounded,
} from "@mui/icons-material";
import FaqDetails from "common/FaqDetails/FaqDetails";

const faqItems = [
  {
    icon: <ReceiptLongRounded fontSize="small" />,
    q: "How do I create a new invoice?",
    ans: 'Click on "Edit Invoice" from the left navigation bar and fill out the necessary details.',
  },
  {
    icon: <SaveAltRounded fontSize="small" />,

    q: "Can I save an invoice as a draft?",
    ans: "Yes, you can save any in-progress invoice as a draft and return to edit it later.",
  },
  {
    icon: <SendRounded fontSize="small" />,

    q: "How do I send an invoice to a client?",
    ans: 'After creating the invoice, click "Options" on the top right and click on the send email button. The system will email a copy of the invoice in table format to the provided email address of the reciever.',
  },
  {
    icon: <PrintOutlined fontSize="small" />,

    q: "Can I print my invoice?",
    ans: 'Yes. Click "Options", on the top right and click the print button from the "View Invoice" page. Select if you want to add the watermark or not. Select landscape mode for a better flushed out pdf.',
  },
  {
    icon: <HelpRounded fontSize="small" />,
    q: "Is there a guide that I can follow?",

    ans: 'Yes. Every page has its own help and support page. Click on "Options" and press "Help and Support" on any page.',
  },
];

export default function Faq() {
  return <FaqDetails data={faqItems} />;
}
