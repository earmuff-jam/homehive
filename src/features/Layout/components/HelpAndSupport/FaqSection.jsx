// import React from "react";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Box,
//   Typography,
// } from "@mui/material";

// const faqItems = [
//   {
//     question: "How do I create a new invoice?",
//     answer:
//       'Click on "Edit Invoice" from the left navigation bar and fill out the necessary details.',
//   },
//   {
//     question: "Can I save an invoice as a draft?",
//     answer:
//       "Yes, you can save any in-progress invoice as a draft and return to edit it later.",
//   },
//   {
//     question: "How do I send an invoice to a client?",
//     answer:
//       'After creating the invoice, click "Options" on the top right and click on the send email button. The system will email a copy of the invoice in table format to the provided email address of the reciever.',
//   },
//   {
//     question: "Can I print my invoice?",
//     answer:
//       'Yes. Click "Options", on the top right and click the print button from the "View Invoice" page. Select if you want to add the watermark or not. Select landscape mode for a better flushed out pdf.',
//   },
//   {
//     question: "Is there a guide that I can follow?",
//     answer:
//       'Yes. Every page has its own help and support page. Click on "Options" and press "Help and Support" on any page.',
//   },
// ];

// export default function FaqSection() {
//   return (
//     <>
//       <Box margin="2rem 1rem">
//         <Typography
//           variant="h5"
//           component="h2"
//           color="text.secondary"
//           gutterBottom
//         >
//           Frequently Asked Questions
//         </Typography>
//       </Box>
//       {faqItems.map((item, index) => {
//         return (
//           <Accordion
//             key={index}
//             defaultExpanded={index === 0}
//             disableGutters
//             elevation={0}
//             sx={{ marginBottom: "1rem" }}
//           >
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   fontSize: "1.125rem",
//                   textTransform: "none",
//                   color: "text.secondary",
//                 }}
//               >
//                 {item.question}
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <Typography
//                 variant="body2"
//                 sx={{ textTransform: "none", color: "text.secondary" }}
//               >
//                 {item.answer}
//               </Typography>
//             </AccordionDetails>
//           </Accordion>
//         );
//       })}
//     </>
//   );
// }
