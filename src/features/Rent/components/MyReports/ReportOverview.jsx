import React from "react";

import { Paper, Stack } from "@mui/material";
import FinancialHealthAccordion from "features/Rent/components/MyReports/FinancialHealthAccordion";
import PortfolioHealth from "features/Rent/components/MyReports/PortfolioHealth";
import { useCalculateFinancialHealth } from "features/Rent/hooks/useCalculateFinancialHealth";
import { useCalculatePropertyHealth } from "features/Rent/hooks/useCalculatePropertyHealth";

const ReportOverview = ({ properties }) => {
  const portfolioHealth = useCalculatePropertyHealth(properties);
  const financialHealth = useCalculateFinancialHealth(properties);
  return (
    <Paper variant="outlined" sx={{ padding: 2 }} data-tour="report-stats-0">
      <Stack spacing={1}>
        <PortfolioHealth portfolioHealth={portfolioHealth} />
        <FinancialHealthAccordion financialHealth={financialHealth} />
      </Stack>
    </Paper>
  );
};

export default ReportOverview;
