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
import relativeTime from "dayjs/plugin/relativeTime";
import StatsAccordionDetailsBlock from "features/Rent/components/Reporting/StatsAccordionDetailsBlock";
import { useCalculatePropertyStatistics } from "features/Rent/hooks/useCalculatePropertyStatistics";
import { getOccupancyRate } from "features/Rent/utils";

dayjs.extend(relativeTime);

const PropertyHealthAccordion = ({
  label,
  selected,
  properties,
  existingTenants,
}) => {
  const {
    primaryTenant,
    isAnyTenantSoR,
    selectedProperty,
    propertyVacantDaysCount,
    averageDaysToCompleteVacancy,
    averageEmptyDaysAcrossProperties,
  } = useCalculatePropertyStatistics(properties, selected, existingTenants);

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
            label="Current Vacancy Streak"
            value={`${propertyVacantDaysCount} days`}
            caption={`Occupied since ${dayjs(primaryTenant?.startDate).format("MM-DD-YYYY")}`}
          />
          <StatsAccordionDetailsBlock
            label="Occupancy Rate"
            value={`${getOccupancyRate(selectedProperty, existingTenants, isAnyTenantSoR)}%`}
            caption="Last 12 months"
          />
          <StatsAccordionDetailsBlock
            label="Avg days to fill"
            value={`${averageEmptyDaysAcrossProperties} days`}
            caption="Average days to fill"
          />
          <StatsAccordionDetailsBlock
            label="Total Vacancy days"
            value={`${averageDaysToCompleteVacancy} days`}
            caption="Year to date"
            applyVariant
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default PropertyHealthAccordion;
