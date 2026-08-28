import React, { useEffect, useState } from "react";

import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import {
  DashboardCustomizeRounded,
  RestartAltRounded,
  SaveRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Popover,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AIconButton from "common/AIconButton";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import { pluralize } from "common/utils";
import {
  useGetDashboardWidgetsQuery,
  useUpsertDashboardWidgetsMutation,
} from "features/Api/invoiceApi";
import AddWidget from "features/Invoice/components/AddWidget/AddWidget";
import DndGridLayout from "features/Invoice/components/DndGridLayout/DndGridLayout";
import EditWidgetDrawer from "features/Invoice/components/EditWidget/EditWidgetDrawer";
import { WidgetTypeList } from "features/Invoice/constants";
import { useAppTitle } from "hooks/useAppTitle";

export default function Dashboard() {
  useAppTitle("Dashboard");

  const theme = useTheme();

  const {
    data: dashboardWidgets = [],
    isLoading: isDashboardWidgetsLoading,
    isSuccess: isDashboardWidgetsSuccess,
  } = useGetDashboardWidgetsQuery();

  const [
    upsertWidget,
    { isLoading: isUpsertWidgetLoading, isSuccess: isUpsertWidgetSuccess },
  ] = useUpsertDashboardWidgetsMutation();

  const [anchorEl, setAnchorEl] = useState(null);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [editingWidgetID, setEditingWidgetID] = useState("");

  const medFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const formMethods = useForm({
    mode: "all",
    defaultValues: {
      widgets: [],
    },
  });

  const widgets = useWatch({ control: formMethods?.control, name: "widgets" });

  const { append, remove, move } = useFieldArray({
    control: formMethods.control,
    name: "widgets",
  });

  const submit = (data) => {
    upsertWidget(data?.widgets);
    setEditingWidgetID("");
  };

  const handleClose = () => setAnchorEl(null);
  const handleClick = (ev) => setAnchorEl(ev.currentTarget);

  const handleEditMode = (widgetID) => setEditingWidgetID(widgetID);

  const handleAddWidget = (type) => {
    const selectedWidget = WidgetTypeList.find(
      (widget) => widget.type === type,
    );

    append({
      type: type,
      widgetID: uuidv4(),
      title: selectedWidget.label,
      caption: selectedWidget.caption,
      filters: {},
      config: {
        height: selectedWidget.config.height,
        width: selectedWidget.config.width,
      },
      data: selectedWidget?.data || [],
      columns: selectedWidget?.columns || [],
    });

    setShowSnackbar(true);
    handleClose();
  };

  const handleRemoveWidget = (id) => remove(id);

  const resetDashboardWidgets = () => {
    formMethods.reset({ widgets: [] });
    handleClose();
  };

  useEffect(() => {
    if (isUpsertWidgetSuccess) {
      setShowSnackbar(true);
    }
  }, [isUpsertWidgetLoading]);

  useEffect(() => {
    if (isDashboardWidgetsSuccess) {
      formMethods.reset({
        widgets: dashboardWidgets,
      });
    } else {
      formMethods.reset({ widgets: [] });
    }
  }, [dashboardWidgets, isDashboardWidgetsLoading]);

  return (
    <Stack>
      <FormProvider {...formMethods}>
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
            {!medFormFactor && (
              <RowHeader
                title="Viewing standard layout"
                caption={`Displaying ${widgets.length} ${pluralize(
                  widgets?.length,
                  "widget",
                )}`}
                sxProps={{
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Save changes in dashboard">
              <AIconButton
                data-tour="dashboard-1"
                onClick={formMethods.handleSubmit(submit)}
                label={<SaveRounded fontSize="small" color="primary" />}
              />
            </Tooltip>
            <Tooltip title="Add Widget">
              <AIconButton
                onClick={handleClick}
                data-tour="dashboard-1"
                label={
                  <DashboardCustomizeRounded fontSize="small" color="primary" />
                }
              />
            </Tooltip>
            <Tooltip title="Reset dashboard to its original form">
              <span>
                <AIconButton
                  onClick={resetDashboardWidgets}
                  variant="contained"
                  data-tour="dashboard-2"
                  disabled={widgets?.length <= 0}
                  label={<RestartAltRounded fontSize="small" />}
                />
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Box data-tour={"dashboard-3"}>
          <DndGridLayout
            handleWidgetMove={move}
            handleEditMode={handleEditMode}
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

        {Boolean(editingWidgetID) && (
          <EditWidgetDrawer
            editingWidgetID={editingWidgetID}
            handleEditingWidget={handleEditMode}
          />
        )}

        <CustomSnackbar
          showSnackbar={showSnackbar}
          setShowSnackbar={setShowSnackbar}
          title="Dashboard changes saved."
        />
      </FormProvider>
    </Stack>
  );
}
