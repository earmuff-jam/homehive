import React from "react";

import { Paper, Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import PieChart from "features/Rent/components/MyReports/ PieChart";
import SeriesChart from "features/Rent/components/MyReports/SeriesChart";
import { useCalculateProjectedRentalChange } from "features/Rent/hooks/useCalculateProjectedRentalChange";
import { useCalculateTotalCollectedRents } from "features/Rent/hooks/useCalculateTotalCollectedRents";

const IncomeProjectionWidget = ({ properties, existingRents }) => {
  const avgProjectedIncrease = properties?.reduce(
    (acc, el) => (acc += Number(el?.rentIncrement)),
    0,
  );

  const projectedRentalChange = useCalculateProjectedRentalChange(
    existingRents,
    avgProjectedIncrease,
  );

  const collectedRents = useCalculateTotalCollectedRents(
    properties,
    existingRents,
  );

  const flattenedCollectedRents = collectedRents?.flatMap(
    (collected) => collected,
  );

  return (
    <Paper variant="outlined" sx={{ padding: 2 }}>
      <RowHeader
        title="Rental Income Projection"
        caption="View rental income projection and collected rents"
        sxProps={{
          fontWeight: "bold",
          color: "text.secondary",
          textAlign: "left",
        }}
      />
      {flattenedCollectedRents?.length <= 0 ? (
        <EmptyComponent caption="Add rental payments to begin" />
      ) : (
        <Stack
          spacing={1}
          marginTop={2}
          justifyContent="space-between"
          direction={{ md: "row", xs: "column" }}
          width="auto"
          height="auto"
          alignSelf="inherit"
        >
          <SeriesChart
            dataTour="report-stats-1"
            label="Average Rental Income Projection"
            data={projectedRentalChange}
          />
          <PieChart
            dataTour="report-stats-2"
            label="Total Collected Rents"
            data={collectedRents}
          />
        </Stack>
      )}
    </Paper>
  );
};

export default IncomeProjectionWidget;
