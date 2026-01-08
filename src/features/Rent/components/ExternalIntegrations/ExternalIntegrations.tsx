import { useState } from "react";

import { DocumentScannerRounded, PaymentRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import {
  TExternalIntegrationKey,
  TOptionSubMenuOption,
} from "features/Rent/Rent.types";
import EsignConnect from "features/Rent/components/EsignConnect/EsignConnect";
import TabPanel from "features/Rent/components/ExternalIntegrations/TabPanel";
import StripeConnect from "features/Rent/components/StripeConnect/StripeConnect";

const options: Record<TExternalIntegrationKey, TOptionSubMenuOption> = {
  stripe: {
    label: "Stripe",
    title: "stripe",
    icon: <PaymentRounded fontSize="small" />,
    content: <StripeConnect />,
  },
  esign: {
    label: "Esign",
    title: "esign",
    icon: <DocumentScannerRounded fontSize="small" />,
    content: <EsignConnect />,
  },
};

export default function ExternalIntegrations() {
  const [selected, setSelected] = useState<TExternalIntegrationKey>(
    options.stripe.title,
  );

  const handleSelected = (value: TExternalIntegrationKey) => setSelected(value);

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
