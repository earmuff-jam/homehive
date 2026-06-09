import React from "react";

import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import StatsAccordionDetailsBlock from "features/Rent/components/Reporting/StatsAccordionDetailsBlock";

const MaintenanceHealthAccordion = ({ label }) => {
  return (
    <Accordion
      elevation={0}
      key={label}
      sx={{
        cursor: "default",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreRounded fontSize="small" />}>
        <Stack flexGrow={1} spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Stack spacing={0.25}>
              <Stack direction="row" alignItems="center">
                <Stack
                  sx={{
                    justifyContent: "left",
                    textAlign: "left",
                    borderRadius: 1,
                    width: "100%",
                  }}
                >
                  <Typography
                    color="primary"
                    fontWeight="light"
                    textTransform="capitalize"
                  >
                    {label}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          spacing={1}
          flexWrap="wrap"
          direction={{ sm: "column", md: "row" }}
          width="100%"
        >
          <StatsAccordionDetailsBlock
            label="Open requests"
            value={0}
            caption={`Oldest: 0 days ago`}
          />
          <StatsAccordionDetailsBlock
            label="Avg. Resolution time"
            value={0}
            caption={`Last known time`}
          />
          <StatsAccordionDetailsBlock
            label="Total spent YTD"
            // rounding support with tilda
            value={0}
            caption={"vs xxx from last year"}
          />
          <StatsAccordionDetailsBlock
            label="Cost / Rent Ratio"
            value={`0`}
            caption="Of annual rent income"
            applyVariant
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default MaintenanceHealthAccordion;
