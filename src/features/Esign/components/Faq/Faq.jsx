import React from "react";

import {
  AddCircleOutlineRounded,
  EmailRounded,
  ForkLeftRounded,
  HelpRounded,
  HomeRounded,
  ManageAccountsOutlined,
  SaveAltRounded,
} from "@mui/icons-material";
import FaqDetails from "common/FaqDetails";

const faqItems = [
  {
    icon: <HomeRounded fontSize="small" />,
    q: "How can I create a new Electronic Signature?",
    ans: 'Click on "Upload Files" button and ensure all fields are filled out. Place respective signature fields and date fields. Once done, press "Prepare Esign" to send the documents for electronic signatures.',
  },
  {
    icon: <SaveAltRounded fontSize="small" />,
    q: "Do I have to purchase tokens to send electronic signatures?",
    ans: "Yes, you must purchase tokens to send electronic signatures. Each prepared document - 'Envelope' cost 1 token to send. Once the documents are sent, the tokens are consumed. All parties will be notifed by email for the status of the electronic signature.",
  },
  {
    icon: <AddCircleOutlineRounded fontSize="small" />,
    q: "How to add signers to the selected document?",
    ans: "Add signers with the button 'Add new signers'. You can add upto four signers. Each signer requires their own email address and full name. Once a signer is selected, you can create boxes in the document that represent the signing fields.",
  },
  {
    icon: <ManageAccountsOutlined fontSize="small" />,
    q: "Can we use the default provided templates?",
    ans: "Yes, for better user experience, we have added four default lease templates to choose from. You can freely use any of them. Once the document is upto your liking, feel free to send the document for electronic signatures.",
  },
  {
    icon: <ForkLeftRounded fontSize="small" />,
    q: "What is the difference between creator and other signers?",
    ans: "Creators are the original owners of the document. They are by design required to sign first before other signers can complete their signature. They are also responsible to purchase token before the electronic signature can take into effect.",
  },
  {
    icon: <EmailRounded fontSize="small" />,
    q: "Do you send reminders if the document is not signed?",
    ans: "Yes, we do send automatic email reminders urging the tenants to sign the provided document.",
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
