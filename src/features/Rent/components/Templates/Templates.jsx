import React, { useState } from "react";

import { TaskRounded } from "@mui/icons-material";
import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Template from "features/Rent/components/Templates/Template";
import { DefaultTemplateData } from "features/Rent/components/Templates/constants";

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState("invoice");

  const updateSelectedTemplate = (val) => setSelectedTemplate(val);

  const handleSave = (data) => {
    console.log(data);
    // don't update default existing template.
    // we want to provide users the ability to reset if need to.
    // get existing data.
    // update data
    // push new data.
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        {/* Template Nav */}
        <Card elevation={0} sx={{ padding: 0, textAlign: "center" }}>
          {Object.entries(DefaultTemplateData).map(([key, template]) => (
            <List
              dense
              key={key}
              component="nav"
              sx={{ padding: 0, margin: 0 }}
            >
              <ListItemButton
                selected={key === selectedTemplate}
                onClick={() => updateSelectedTemplate(key)}
              >
                <ListItem>
                  <ListItemIcon>
                    <TaskRounded fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={template?.label}
                    secondary={template?.caption}
                    slotProps={{
                      primary: {
                        variant: "caption",
                        fontWeight: "bold",
                      },
                      secondary: {
                        variant: "caption",
                      },
                    }}
                  />
                </ListItem>
              </ListItemButton>
            </List>
          ))}
        </Card>
      </Grid>

      {/* Content */}
      <Grid item xs={12} md={9}>
        <Card
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: 2,
          }}
        >
          <Template
            handleSave={handleSave}
            template={DefaultTemplateData[selectedTemplate]}
          />
        </Card>
      </Grid>
    </Grid>
  );
}
