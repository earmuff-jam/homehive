import React, { useState } from "react";

import { Paper, Stack, Typography } from "@mui/material";
import PropertyMenuItemSelector from "features/Rent/components/MyReports/PropertyMenuItemSelector";
import PropertyStatistics from "features/Rent/components/MyReports/PropertyStatistics";

const StatisticsWidget = ({
  data = [],
  existingTenants = [],
  existingRents = [],
}) => {
  const [selected, setSelected] = useState("");
  const onSelectedItemChange = (event) => setSelected(event.target.value);

  return (
    <Paper variant="outlined" sx={{ padding: 2 }} data-tour="report-stats-3">
      <Stack
        direction="row"
        textAlign="left"
        alignContent="center"
        justifyContent="space-between"
      >
        <Stack>
          <Typography variant="h5" fontWeight="medium">
            Property statistics
          </Typography>
          <Typography variant="subtitle2">
            View statistics about your registered properties
          </Typography>
        </Stack>
        <PropertyMenuItemSelector
          inputLabel="Property"
          selectedItem={selected}
          onChange={onSelectedItemChange}
          data={data}
        />
      </Stack>

      <PropertyStatistics
        properties={data}
        selected={selected}
        existingTenants={existingTenants}
        existingRents={existingRents}
      />
    </Paper>
  );
};

export default StatisticsWidget;
