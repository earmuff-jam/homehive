import React from "react";

import { Box, Stack, Typography } from "@mui/material";

// FinancialHealthBlock ...
// defines the financial health block
const FinancialHealthBlock = ({ data, label = "" }) => {
  return (
    <Box
      sx={{
        paddingX: 4,
        paddingY: 2,
        flex: 1,
        bgcolor: "background.default",
        textAlign: "center",
        borderRadius: 0.8,
      }}
    >
      <Typography fontSize="2rem" color="primary" fontWeight="light">
        ${data?.toFixed(2)}
      </Typography>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
};

const FinancialHealthAccordion = ({ financialHealth }) => {
  return (
    <>
      <Stack
        spacing={1}
        justifyContent="center"
        direction={{ sm: "row", xs: "column" }}
      >
        <FinancialHealthBlock
          data={financialHealth?.totalMonthlyRentalIncome || 0}
          label="Total Monthly Rent Income"
        />
        <FinancialHealthBlock
          data={financialHealth?.averageRentPerSqFt || 0}
          label="Average Rent / Sq Ft"
        />
        <FinancialHealthBlock
          data={financialHealth?.securityDepositsCollected || 0}
          label="Collected Security Deposits"
        />
      </Stack>
    </>
  );
};

export default FinancialHealthAccordion;
