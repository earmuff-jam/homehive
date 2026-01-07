import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import {
  AddRounded,
  EditRounded,
  RestartAltRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { parseJsonUtility, pluralize } from "common/utils";
import AddWidget from "features/Invoice/components/AddWidget/AddWidget";
import DndGridLayout from "features/Invoice/components/DndGridLayout/DndGridLayout";
import RowHeader from "features/Invoice/components/RowHeader/InvoiceRowHeader";
import { Widgets } from "features/Invoice/constants";
import { TWidget } from "features/Invoice/types/Invoice.types";
import { useAppTitle } from "hooks/useAppTitle";

export default function Dashboard() {
  useAppTitle("Dashboard");

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [widgets, setWidgets] = useState<TWidget[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false); // re-arrange widgets
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const medFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => setAnchorEl(null);
  const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(ev.currentTarget);

  const handleAddWidget = (id: number) => {
    const selectedWidget = Widgets.find((widgetType) => widgetType.id === id);

    setWidgets((prevWidgets) => {
      const updatedWidgets = [
        ...prevWidgets,
        // create a custom uuid to associate the widget for ui.
        // widgetId !== config.widgetId
        { ...selectedWidget, widgetId: uuidv4() },
      ];
      localStorage.setItem("widgets", JSON.stringify(updatedWidgets));

      return updatedWidgets;
    });

    setShowSnackbar(true);
    handleClose();
  };

  const handleRemoveWidget = (widgetId: number) => {
    setWidgets((prevWidgets) => {
      const remainingWidgets = prevWidgets.filter(
        (widget) => widget.id !== widgetId,
      );

      localStorage.setItem("widgets", JSON.stringify(remainingWidgets));
      return remainingWidgets;
    });
  };

  const reset = () => {
    setWidgets([]);
    localStorage.setItem("widgets", JSON.stringify([]));
    handleClose();
  };

  useEffect(() => {
    const draftWidgets = parseJsonUtility<TWidget[]>(
      localStorage.getItem("widgets"),
    );
    if (draftWidgets) {
      setWidgets(draftWidgets);
    }
  }, []);

  return (
    <Stack>
      {medFormFactor && (
        <Alert severity="warning">
          <Typography variant="caption">
            Dashboard is best viewed on a larger screen.
          </Typography>
        </Alert>
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        data-tour={"dashboard-0"}
      >
        <Stack direction="row">
          <Tooltip
            title={editMode ? "Save widget layout" : "Edit widget layout"}
          >
            <Box component="span">
              <IconButton
                sx={{ alignSelf: "flex-start" }}
                color="primary"
                disabled={widgets.length <= 0}
                onClick={() => setEditMode(!editMode)}
              >
                <EditRounded
                  fontSize="inherit"
                  color={editMode ? "primary" : "inherit"}
                />
              </IconButton>
            </Box>
          </Tooltip>
          {!medFormFactor && (
            <RowHeader
              sxProps={{ textAlign: "left", fontWeight: "bold" }}
              title={editMode ? "Editing Layout" : "Standard layout"}
              caption={`Displaying ${widgets.length} ${pluralize(
                widgets?.length,
                "widget",
              )}`}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Add Widget">
            <IconButton onClick={handleClick} data-tour={"dashboard-1"}>
              <AddRounded fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <AButton
            data-tour={"dashboard-2"}
            variant="outlined"
            endIcon={<RestartAltRounded fontSize="small" />}
            onClick={reset}
            label="Reset"
          />
        </Stack>
      </Stack>

      <Box data-tour={"dashboard-3"}>
        <DndGridLayout
          editMode={editMode}
          widgets={widgets}
          setWidgets={setWidgets}
          handleRemoveWidget={handleRemoveWidget}
        />
      </Box>

      {/* Add Widget Popover Content */}
      <Popover
        id={open ? "simple-popover" : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <AddWidget handleAddWidget={handleAddWidget} />
      </Popover>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        severity="success"
        title="Successfully added new widget."
      />
    </Stack>
  );
}
