import React from "react";

import dayjs from "dayjs";

import { ExpandMoreRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import StatsAccordionDetailsBlock from "features/Rent/components/Reporting/StatsAccordionDetailsBlock";
import { useCalculateMaintenanceDetails } from "features/Rent/hooks/useCalculateMaintenanceDetails";

const MaintenanceHealthAccordion = ({
  label,
  dataTour,
  maintenanceRecords = [],
  totalRentalIncomeForYr,
}) => {
  const {
    openMaintenanceRecords,
    totalSpentCurrentYear,
    totalSpentPreviousYear,
    averageResolutionTime,
    latestUpdatedOn,
    costRentRatio,
  } = useCalculateMaintenanceDetails(
    maintenanceRecords,
    totalRentalIncomeForYr,
  );

  return (
    <Accordion
      elevation={0}
      data-tour={dataTour}
      defaultExpanded
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
            value={openMaintenanceRecords?.length || 0}
            caption={
              openMaintenanceRecords?.length === 0
                ? "N/A"
                : `Oldest: ${dayjs(latestUpdatedOn).fromNow()}`
            }
          />
          <StatsAccordionDetailsBlock
            label="Avg. Resolution time"
            value={averageResolutionTime}
            caption={`Last known time`}
          />
          <StatsAccordionDetailsBlock
            label="Total spent YTD"
            // rounding support with tilda
            value={`$${totalSpentCurrentYear}`}
            caption={`vs $${totalSpentPreviousYear} from last year`}
          />
          <StatsAccordionDetailsBlock
            label="Maintenance / Rent Ratio"
            value={`${(costRentRatio * 100).toFixed(2)}`}
            caption="Of annual rent income"
            applyVariant
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default MaintenanceHealthAccordion;
