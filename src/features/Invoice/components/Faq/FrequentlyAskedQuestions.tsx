import React, { ReactNode } from "react";

import {
  HelpRounded,
  PrintOutlined,
  ReceiptLongRounded,
  SaveAltRounded,
  SendRounded,
} from "@mui/icons-material";
import FaqDetails from "common/FaqDetails/FaqDetails";

// InvoicerFrequentlyAskedQuestion ...
export type InvoicerFrequentlyAskedQuestion = {
  icon: ReactNode;
  question: string;
  answer: string;
};

const invoicerFreqentlyAskedQuestions: InvoicerFrequentlyAskedQuestion[] = [
  {
    icon: <ReceiptLongRounded fontSize="small" />,
    question: "How do I create a new invoice?",
    answer:
      'Click on "Edit Invoice" from the left navigation bar and fill out the necessary details.',
  },
  {
    icon: <SaveAltRounded fontSize="small" />,

    question: "Can I save an invoice as a draft?",
    answer:
      "Yes, you can save any in-progress invoice as a draft and return to edit it later.",
  },
  {
    icon: <SendRounded fontSize="small" />,

    question: "How do I send an invoice to a client?",
    answer:
      'After creating the invoice, click "Options" on the top right and click on the send email button. The system will email a copy of the invoice in table format to the provided email address of the reciever.',
  },
  {
    icon: <PrintOutlined fontSize="small" />,

    question: "Can I print my invoice?",
    answer:
      'Yes. Click "Options", on the top right and click the print button from the "View Invoice" page. Select if you want to add the watermark or not. Select landscape mode for a better flushed out pdf.',
  },
  {
    icon: <HelpRounded fontSize="small" />,
    question: "Is there a guide that I can follow?",
    answer:
      'Yes. Every page has its own help and support page. Click "Question Mark" on the top right corner of your screen. Available pages display "Help and Support". Click on it to view the guide.',
  },
];

export default function FrequentlyAskedQuestions() {
  return <FaqDetails data={invoicerFreqentlyAskedQuestions} />;
}
