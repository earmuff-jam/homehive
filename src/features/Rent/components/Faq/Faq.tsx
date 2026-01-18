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
import { TFrequentlyAskedQuestion } from "common/types";

const rentalAppFaq: TFrequentlyAskedQuestion[] = [
  {
    icon: <HomeRounded fontSize="small" />,
    question: "How can I create a new property?",
    answer:
      'Click on Add Property" button and ensure all fields are filled out. Press submit when done.',
  },
  {
    icon: <SaveAltRounded fontSize="small" />,
    question:
      "Can I update property data even after tenants are added to the property?",
    answer:
      "Yes, you can only update general property information at any time. 'Rental Information' section is disabled if you currently have active tenants.",
  },
  {
    icon: <AddCircleOutlineRounded fontSize="small" />,
    question: "How to add tenants to a single property?",
    answer:
      "Add tenants to any associated property with the help of 'Associate Tenants' button in the property page. You can also remove the selected tenant. All tenants can have their own initial late and daily late fee.",
  },
  {
    icon: <ManageAccountsOutlined fontSize="small" />,
    question: "How to manage payments automatically?",
    answer:
      "We use stripe to manage payments from your bank account. The property owner is responsible for setting up the stripe details and the payment can only be made by the rentee if the account setup is correct and the current month is due. If the current month is not due, the rentee cannot pay in advance.",
  },
  {
    icon: <ForkLeftRounded fontSize="small" />,
    question:
      "I don't want to use any automatic payment system. Can i manage it myself?",
    answer:
      "Yes, using stripe payment services is not necessary at all. You can manually update your rent records via the 'Pay Rent Manually' button. This button is only available for property owners. ",
  },
  {
    icon: <EmailRounded fontSize="small" />,
    question: "Do you send reminders if the rent is due?",
    answer:
      "Yes, we do send automatic email reminders. Emails are sent out periodically and can also be manually triggered.",
  },
  {
    icon: <PrintOutlined fontSize="small" />,
    question: "Can i print my data?",
    answer:
      "We don’t have a built-in “Print” button, but you’re free to print anything you see. Just use your browser’s print command (Ctrl / Cmd + P) or right-click → Print.",
  },
  {
    icon: <HelpRounded fontSize="small" />,
    question: "Is there a guide that I can follow?",
    answer:
      'Yes. Every page has its own help and support page. Click "Question Mark" on the top right corner of your screen. Available pages display "Help and Support". Click on it to view the guide.',
  },
];

export default function Faq() {
  return <FaqDetails data={rentalAppFaq} />;
}
