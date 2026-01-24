import React, { useState } from "react";

import { Card, Stack } from "@mui/material";
import TabPanel from "features/Rent/common/TabPanel";
import Template from "features/Rent/components/Templates/Template";
import { DefaultRentalAppEmailTemplates } from "features/Rent/components/Templates/constants";
import { produce } from "immer";

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState("invoice");

  const updatedSelected = (val) => setSelectedTemplate(val);

  const handleSave = (data) => {
    const existingTemplates =
      JSON.parse(localStorage.getItem("templates")) || {};

    const updatedTemplates = produce(existingTemplates, (draft) => {
      draft[data.title] = data;
    });
    localStorage.setItem("templates", JSON.stringify(updatedTemplates));
  };

  return (
    <Stack alignItems="center" spacing={1}>
      <Stack direction="row" spacing={2}>
        <TabPanel
          options={DefaultRentalAppEmailTemplates}
          selected={selectedTemplate}
          updateSelected={updatedSelected}
        />
      </Stack>
      <Stack width="100%">
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            p: 2,
          }}
        >
          <Template
            handleSave={handleSave}
            template={DefaultRentalAppEmailTemplates[selectedTemplate]}
          />
        </Card>
      </Stack>
    </Stack>
  );
}
