import React from "react";

import { AddRounded } from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import { WidgetTypeList } from "features/Invoice/constants";

export default function AddWidget({ handleAddWidget }) {
  return (
    <Stack sx={{ minWidth: "12rem", padding: "1rem 1rem 0rem 1rem" }}>
      <Typography>Add Widget</Typography>
      <Divider />
      <MenuList dense>
        {WidgetTypeList.map((widget) => (
          <MenuItem
            key={widget.type}
            onClick={() => handleAddWidget(widget?.type)}
          >
            <ListItemIcon>
              <AddRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>{widget.label}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Stack>
  );
}
