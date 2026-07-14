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

dayjs.extend(relativeTime);

const LeaseHealthAccordion = ({
  label,
  selected,
  dataTour,
  properties,
  existingTenants = [],
}) => {
  const { primaryTenant, leaseExiprationDate } = useCalculatePropertyStatistics(
    properties,
    selected,
    existingTenants,
  );

  const selectedTenant = existingTenants?.filter(
    (et) => et.propertyId === selected,
  );

  return (
    <Accordion
      data-tour={dataTour}
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
            label="Lease expires in"
            // diff in days since lastMoveOut happened; does not fall below 0
            value={`${Math.max(dayjs(leaseExiprationDate).diff(dayjs(), "day"), 0) || 0} days`}
            caption={`Occupied since ${dayjs(primaryTenant?.startDate).format("MM-DD-YYYY")}`}
          />
          <StatsAccordionDetailsBlock
            label="Tenant tenure"
            value={`${dayjs().diff(dayjs(primaryTenant?.startDate), "day")} days`}
            caption={`Since ${dayjs(primaryTenant?.startDate).format("MM-DD-YYYY")}`}
          />
          <StatsAccordionDetailsBlock
            label="Renewal Rate"
            // rounding support with tilda
            // Jira - #320 Parent ticket to complete this ask
            value={`${~~((existingTenants?.length / existingTenants?.length) * 100)}%`}
            caption={`${selectedTenant?.length} out of ${existingTenants?.length} tenants renewed`}
          />
          <StatsAccordionDetailsBlock
            label="Avg lease length"
            // Jira - #320 Parent ticket to complete this ask
            value={`${primaryTenant?.term || 0}`}
            caption="Across all tenants"
            applyVariant
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default LeaseHealthAccordion;
