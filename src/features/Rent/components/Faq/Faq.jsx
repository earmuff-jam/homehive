import React from "react";

import {
  AddCircleOutlineRounded,
  EmailRounded,
  ForkLeftRounded,
  HelpRounded,
  HomeRounded,
  ManageAccountsOutlined,
  PrintOutlined,
  SaveAltRounded,
} from "@mui/icons-material";
import FaqDetails from "common/FaqDetails/FaqDetails";

const faqItems = [
  {
    icon: <HomeRounded fontSize="small" />,
    q: "How should I create a new property?",
    ans: 'Click on Add Property" button and ensure all fields are filled out',
  },
  {
    icon: <SaveAltRounded fontSize="small" />,
    q: "Can I update properties after tenants are associated?",
    ans: "Yes, you can update properties and new changes take precedence.",
  },
  {
    icon: <AddCircleOutlineRounded fontSize="small" />,
    q: "How to add tenants to a single property?",
    ans: "Add tenants to any associated property with the help of 'Associate Tenants' button in the property page. You can also remove the selected tenant. All tenants can have their own initial late and daily late fee. Additional fees for the property and the rent itself is built into the property itself. ",
  },
  {
    icon: <ManageAccountsOutlined fontSize="small" />,
    q: "How to manage payments?",
    ans: "We use stripe to manage payments from your bank account. The property owner is responsible for setting up the stripe details and the payment can only be made by the rentee if the account setup is correct and the current month is due. If the current month is not due, the rentee cannot pay in advance.",
  },
  {
    icon: <ForkLeftRounded fontSize="small" />,
    q: "I don't want to use any automatic payment system. Can i manage it myself?",
    ans: "Yes, using stripe payment services is not necessary at all. You can manually update your rent records via the 'Pay Rent Manually' button. This button is only available for property owners. ",
  },
  {
    icon: <EmailRounded fontSize="small" />,
    q: "Do you send reminders if the rent is due?",
    ans: "Yes, we do send automatic email reminders. The current configuration for email reminders is 7, 4, 3, 1, 0 days. Emails should go out on these said dates if the new month rent is due.",
  },
  {
    icon: <PrintOutlined fontSize="small" />,
    q: "Can i print my data?",
    ans: "No, not technically. but you could use the web browser to view data to print and take screensoht from there.",
  },
  {
    icon: <HelpRounded fontSize="small" />,
    q: "Is there a guide that I can follow?",
    ans: 'Yes. Every page has its own help and support page. Click "Question Mark" on the top right corner of your screen. Available pages display "Help and Support". Click on it to view the guide.',
  },
];

export default function Faq() {
  return <FaqDetails data={faqItems} />;
}
