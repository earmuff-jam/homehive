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
import FaqDetails from "common/FaqDetails";

const faqItems = [
  {
    icon: <HomeRounded fontSize="small" />,
    q: "How can I create a new property?",
    ans: 'Click on "Add Property" button and ensure all fields are filled out. Press submit when done.',
  },
  {
    icon: <SaveAltRounded fontSize="small" />,
    q: "Can I update property data even after tenants are added to the property?",
    ans: "No, you cannot update property data after tenants are added to the property. You may edit the property details once the tenants are removed from the property. Performing actions such as removing a tenant from a property, adding rent payments to the property and / or editing the property will alert the tenant and property owner VIA email, while keeping all audit trails in effect.",
  },
  {
    icon: <AddCircleOutlineRounded fontSize="small" />,
    q: "How to add tenants to a single property?",
    ans: "Add tenants to any associated property with the help of 'Associate Tenants' button in the property page. You can also remove the selected tenant. All tenants can have their own initial late and daily late fee.",
  },
  {
    icon: <ManageAccountsOutlined fontSize="small" />,
    q: "How to manage payments automatically?",
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
    ans: "Yes, our servers are configured to send periodic reminders for rental payments. Tenants are expected to recieve email notifications every 7th, 3rd, 2nd, 1st and the day of. If the due date is passed, tenants can be expected to recieve email notifications every day until the payment is complete or until the month has passed. In the case of the latter, the system automatically repurposes itself with period emails. If you would like to send reminders on your own accord, you also may do such free of charge from the Quick Actions menu.",
  },
  {
    icon: <PrintOutlined fontSize="small" />,
    q: "Can i print my data?",
    ans: "Use your browser’s print command (Ctrl / Cmd + P) or right-click → Print.",
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
