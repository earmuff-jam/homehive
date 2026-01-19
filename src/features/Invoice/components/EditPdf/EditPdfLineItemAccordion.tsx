import React from "react";

import { Control } from "react-hook-form";

import { DeleteRounded, ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Invoice } from "features/Invoice/Invoice.types";
import EditPdfLineItem from "features/Invoice/components/EditPdf/EditPdfLineItem";

// EditPdfLineItemAccordion ...
type EditPdfLineItemAccordion = {
  title: string;
  index: number;
  control: Control<Invoice>;
  onDelete: (digit: number) => void;
};

export default function EditPdfLineItemAccordion({
  title,
  index,
  control,
  onDelete,
}: EditPdfLineItemAccordion) {
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
