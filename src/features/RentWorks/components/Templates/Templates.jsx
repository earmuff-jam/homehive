import React, { useState } from "react";

import { Grid } from "@mui/material";
import Template from "features/RentWorks/components/Templates/Template";
import { DefaultTemplateData } from "features/RentWorks/components/Templates/constants";
import { produce } from "immer";

export default function Templates() {
  const [templates, setTemplates] = useState(DefaultTemplateData);

  const handleTemplateChange = (template, field) => (event) => {
    const value = event.target.value;
    setTemplates((prev) =>
      produce(prev, (draft) => {
        draft[template][field] = value;
      }),
    );
  };

  const handleSave = () =>
    localStorage.setItem("templates", JSON.stringify(templates));

  return (
    <Grid container spacing={3}>
      {Object.entries(templates).map(([key, template]) => (
        <Template
          key={key}
          id={key}
          template={template}
          handleSave={handleSave}
          handleTemplateChange={handleTemplateChange}
        />
      ))}
    </Grid>
  );
}
