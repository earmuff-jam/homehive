import React from "react";

import dayjs from "dayjs";

import { ExpandMoreRounded, InfoOutlineRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import relativeTime from "dayjs/plugin/relativeTime";
import StatsAccordionDetailsBlock from "features/Rent/components/Reporting/StatsAccordionDetailsBlock";
import { useCalculatePropertyStatistics } from "features/Rent/hooks/useCalculatePropertyStatistics";

dayjs.extend(relativeTime);

const RentCollectionAccordion = ({
  label,
  selected,
  properties,
  existingRents,
  existingTenants,
}) => {
  const {
    primaryTenant,
    averageLateRentPayment,
    averageOnTimeRentPayment,
    outstandingBalance,
  } = useCalculatePropertyStatistics(
    properties,
    selected,
    existingTenants,
    existingRents,
  );

  return (
    <Accordion
      elevation={0}
      key={label}
      defaultExpanded
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
            label="On time rent"
            // diff in days since lastMoveOut happened; does not fall below 0
            value={`${~~(averageOnTimeRentPayment * 100)}%`}
            caption="Last 12 months"
          />
          <StatsAccordionDetailsBlock
            label="Avg. days late"
            value={`${~~averageLateRentPayment} days`}
            caption="Last 12 months"
          />
          <StatsAccordionDetailsBlock
            label="Outstanding balance"
            // rounding support with tilda
            value={`${outstandingBalance}$`}
            caption={
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption">Approx</Typography>
                <Tooltip title="Outstanding balance does not take late fees or surcharges into account">
                  <InfoOutlineRounded
                    color="info"
                    sx={{ height: "1rem", width: "1rem" }}
                  />
                </Tooltip>
              </Stack>
            }
          />
          <StatsAccordionDetailsBlock
            label="Cost / Rent Ratio"
            value={`${primaryTenant?.term}`}
            caption="Of annual rent income"
            applyVariant
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default RentCollectionAccordion;
