import React, { useState } from "react";

import { PaymentRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import TabPanel from "features/Rent/common/TabPanel";
import StripeConnect from "features/Rent/components/StripeConnect/StripeConnect";

const options = {
  stripe: {
    label: "Stripe",
    title: "stripe",
    icon: <PaymentRounded fontSize="small" />,
    content: <StripeConnect />,
  },
};

export default function ExternalIntegrations() {
  const [selected, setSelected] = useState(options.stripe.title);

  const handleSelected = (value) => setSelected(value);

  return (
    <Stack alignItems="center" spacing={1}>
      <Stack direction="row" spacing={2}>
        <TabPanel
          options={options}
          selected={selected}
          updateSelected={handleSelected}
        />
      </Stack>
      <Stack width="100%">{options[selected]?.content}</Stack>
    </Stack>
  );
}
