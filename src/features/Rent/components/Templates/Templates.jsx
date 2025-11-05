import React, { useState } from "react";

import { Card, Stack } from "@mui/material";
import Template from "features/Rent/components/Templates/Template";
import TemplateSelectors from "features/Rent/components/Templates/TemplateSelectors";
import { DefaultTemplateData } from "features/Rent/components/Templates/constants";
import { produce } from "immer";

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState("invoice");

  const updateSelectedTemplate = (val) => setSelectedTemplate(val);

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
        <TemplateSelectors
          selectedTemplate={selectedTemplate}
          DefaultTemplateData={DefaultTemplateData}
          updateSelectedTemplate={updateSelectedTemplate}
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
            template={DefaultTemplateData[selectedTemplate]}
          />
        </Card>
      </Stack>
    </Stack>
  );
}
