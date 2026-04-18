import React from "react";

import { FiberManualRecordRounded } from "@mui/icons-material";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { pluralize } from "common/utils";
import RaspyAIPieChart from "features/Raspy/VisualElements/RaspyAIPieChart";
import RaspyAISeriesChart from "features/Raspy/VisualElements/RaspyAISeriesChart";

export default function ResponseDetails({ data = {} }) {
  const recommendedActions = data?.recommendedActions || [];
  const recommendedActionsArr = recommendedActions.map((i) => i + 1);

  const portfolioHealth = data?.portfolioHealth || {};
  const financialHealth = data?.financialHealth || {};
  const projectedRentalChangeData = data?.projectedRentalChange || [];
  const projectedYearlyRentData = data?.projectedYearlyRent || [];

  const isProjectedDatasetEmpty =
    projectedRentalChangeData.length <= 0 ||
    projectedYearlyRentData.length <= 0;

    console.log(portfolioHealth);
  return (
    <Stack spacing={1}>
      {/* Recommended Action Alert Blocks */}
      <Stack alignSelf="flex-end" direction="row" spacing={0.5}>
        {recommendedActionsArr?.map((item) => (
          <RecommendedActionBlock key={item} blockColor="error.main" />
        ))}
      </Stack>
      {/* Portfolio overall health blocks */}
      <Stack
        spacing={2}
        justifyContent="center"
        direction={{ sm: "row", xs: "column" }}
      >
        <PortfolioHealthBlock
          data={portfolioHealth?.totalProperties || 0}
          label={`Total ${pluralize(portfolioHealth?.totalProperties, "property")}`}
        />
        <PortfolioHealthBlock
          data={portfolioHealth?.vacantProperties || 0}
          label={`Vacant ${pluralize(portfolioHealth?.vacantProperties, "property")}`}
        />
      </Stack>
      {/* Financial health block */}
      <Stack
        spacing={1}
        justifyContent="center"
        direction={{ sm: "row", xs: "column" }}
      >
        <FinancialHealthBlock
          data={financialHealth?.totalMonthlyRentIncome || 0}
          label="Total Monthly Rent Income"
        />
        <FinancialHealthBlock
          data={financialHealth?.averageRentalYield || 0}
          label="Average Rental Yield"
        />
        <FinancialHealthBlock
          data={financialHealth?.securityDepositsCollected || 0}
          label="Collected Security Deposits"
        />
      </Stack>
      <Stack
        spacing={1}
        justifyContent="space-between"
        direction={{ sm: "row", xs: "column" }}
        alignSelf={isProjectedDatasetEmpty ? "center" : "inherit"}
      >
        {isProjectedDatasetEmpty ? (
          <EmptyComponent caption="No recommendations to display" />
        ) : (
          <>
            <RaspyAISeriesChart
              label="Rental Income Projection"
              data={projectedRentalChangeData}
            />
            <RaspyAIPieChart
              label="Collected Rents"
              data={projectedYearlyRentData}
            />
          </>
        )}
      </Stack>
      {/* Recommended Actions List View */}
      <Stack>
        <RecommendedActionList data={recommendedActions} />
      </Stack>
    </Stack>
  );
}

const RecommendedActionList = ({ data = [] }) => {
  if (data?.length <= 0) {
    return <EmptyComponent caption="No recommendation to make at this time." />;
  }
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        Recommended Actions
      </Typography>

      <Box
        sx={{
          maxHeight: data.length > 5 ? 220 : "auto",
          overflowY: data.length > 5 ? "auto" : "visible",
        }}
      >
        <List dense disablePadding>
          {data.map((action, i) => (
            <React.Fragment key={i}>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <FiberManualRecordRounded sx={{ fontSize: 8 }} />
                </ListItemIcon>

                <ListItemText
                  primary={action}
                  slotProps={{
                    primary: {
                      variant: "body2",
                      sx: {
                        color: "text.secondary",
                      },
                    },
                  }}
                />
              </ListItem>

              {i !== data.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

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
      <Typography>{data}</Typography>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
};

const PortfolioHealthBlock = ({ data, label = "" }) => {
  return (
    <Box
      sx={{
        paddingX: 4,
        paddingY: 2,
        bgcolor: "background.default",
        textAlign: "center",
        borderRadius: 0.8,
      }}
    >
      <Typography>{data}</Typography>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
};

const RecommendedActionBlock = ({ blockColor = "primary.main" }) => {
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        bgcolor: blockColor,
        display: "inline-block",
      }}
    />
  );
};
