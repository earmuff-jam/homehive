import React from "react";

import { Stack } from "@mui/material";
import RowHeader from "common/RowHeader";

const Badges = () => {
  // getBadgesQuery

  // tally against the constants ; todo move this to public folder later on

  // display only the ones that match.
  return (
    <Stack>
      <RowHeader
        title="Badges and accolades"
        caption="View your accolades or owned badges"
        sxProps={{
          textAlign: "left",
          color: "text.secondary",
        }}
      />
    </Stack>
  );
};

export default Badges;
