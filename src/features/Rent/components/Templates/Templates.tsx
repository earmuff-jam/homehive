import { useState } from "react";

import { Card, Stack } from "@mui/material";
import { parseJsonUtility } from "common/utils";
import {
  TTemplate,
  TTemplateObjectKeyEnumValues,
  TTemplateProcessorEnumValues,
} from "features/Rent/Rent.types";
import TabPanel from "features/Rent/components/Templates/TabPanel";
import Template from "features/Rent/components/Templates/Template";
import { DefaultTemplateData } from "features/Rent/components/Templates/constants";
import { produce } from "immer";

export default function Templates() {
  const [selectedTemplateLabel, setSelectedTemplateLabel] =
    useState<TTemplateObjectKeyEnumValues>("invoice");

  const updatedSelected = (val: TTemplateObjectKeyEnumValues) =>
    setSelectedTemplateLabel(val);

  const handleSave = (data: TTemplate) => {
    const existingTemplates = parseJsonUtility<TTemplate[]>(
      localStorage.getItem("templates"),
    );

    const updatedTemplates = produce(existingTemplates, (draft) => {
      draft[data.title] = data;
    });
    localStorage.setItem("templates", JSON.stringify(updatedTemplates));
  };

  return (
    <Stack alignItems="center" spacing={1}>
      <Stack direction="row" spacing={2}>
        <TabPanel
          selected={selectedTemplateLabel}
          updateSelected={updatedSelected}
          options={DefaultTemplateData}
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
            template={DefaultTemplateData[selectedTemplateLabel]}
          />
        </Card>
      </Stack>
    </Stack>
  );
}
