import React from "react";

import { DeleteRounded, ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
        <Stack spacing={1} alignItems="center" direction="row">
          <Box onClick={() => onDelete(index)}>
            <DeleteRounded fontSize="small" color="error" />
          </Box>
          <Typography variant="body1" fontWeight="300">
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <EditPdfLineItem control={control} index={index} />
      </AccordionDetails>
    </Accordion>
  );
}
