import React from "react";

import { DeleteRounded, ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditPdfLineItem from "features/Invoice/components/EditPdf/EditPdfLineItem";

export default function EditPdfLineItemAccordion({
  title,
  index,
  control,
  onDelete,
}) {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Stack alignItems={"center"} direction="row">
          <IconButton size="small" onClick={() => onDelete(index)}>
            <DeleteRounded fontSize="small" color="error" />
          </IconButton>
          <Typography>{title}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
         <EditPdfLineItem control={control} index={index} />
      </AccordionDetails>
    </Accordion>
  );
}
