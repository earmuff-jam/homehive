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
import { Widgets } from "features/Invoice/constants";

// AddWidgetProps ...
type AddWidgetProps = {
  handleAddWidget: (widgetId: number) => void;
};

export default function AddWidget({ handleAddWidget }: AddWidgetProps) {
  return (
    <Stack sx={{ minWidth: "12rem", padding: "1rem 1rem 0rem 1rem" }}>
      <Typography>Add Widget</Typography>
      <Divider />
      <MenuList dense>
        {Widgets.map((widgetType) => (
          <MenuItem
            key={widgetType.id}
            onClick={() => handleAddWidget(widgetType.id)}
          >
            <ListItemIcon>
              <AddRounded />
            </ListItemIcon>
            <ListItemText inset={widgetType.config.inset}>
              {widgetType.label}
            </ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Stack>
  );
}
