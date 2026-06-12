import React, { useMemo, useState } from "react";

import dayjs from "dayjs";

import {
  CommentRounded,
  EditAttributesOutlined,
  PendingActionsOutlined,
  Remove,
  TaskAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateMaintenanceItemStatus from "features/Rent/components/Maintenance/UpdateMaintenanceItemStatus";
import {
  AddMaintenanceRecordCompletedResolutionString,
  AddMaintenanceRecordPendingResolutionString,
  AddMaintenanceRecordRemovedResolutionString,
  MaintenanceRecordEnumValues,
} from "features/Rent/constants";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

// DefaultDialogProps ...
// defines the default props for dialog component
const DefaultDialogProps = {
  title: "",
  id: "",
  status: "",
  type: "",
  display: false,
};

const ViewMaintenanceRecord = ({
  data = [],
  propertyName,
  primaryTenantEmail,
}) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [dialog, setDialog] = useState(DefaultDialogProps);

  const closeDialog = () => {
    setDialog(DefaultDialogProps);
  };

  const toggleDialog = (action, rowId, status) => {
    setDialog({
      title: `Update status: ${status}`,
      id: rowId,
      type: action,
      status: status,
      display: true,
    });
  };

  const isSelectionDisabled = (actualStatus, rowStatus) =>
    actualStatus === rowStatus;

  const columns = useMemo(
    () => [
      {
        header: "Category",
        size: 50,
        accessorKey: "maintenanceCategory",
        id: "maintenanceCategory",
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">{cell?.getValue()}</Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 50,
        Cell: ({ cell }) =>
          cell?.getValue() ? (
            <Typography variant="subtitle2">{cell.getValue()}</Typography>
          ) : (
            "-"
          ),
      },
      {
        header: "Description",
        size: 200,
        accessorKey: "description",
        id: "description",
        Cell: ({ cell }) =>
          (
            <Tooltip title={cell?.getValue()}>
              <Typography variant="subtitle2" noWrap sx={{ width: 200 }}>
                {cell.getValue()}
              </Typography>
            </Tooltip>
          ) || "-",
      },
      {
        accessorKey: "tenantEmail",
        header: "Tenant Email",
        size: 150,
        Cell: ({ cell }) =>
          <Typography variant="subtitle2">{cell.getValue()}</Typography> || "-",
      },
      {
        accessorKey: "updatedOn",
        header: "Updated on",
        size: 150,
        Cell: ({ cell }) =>
          cell.getValue()
            ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm:ss")
            : "-",
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableRowActions: true,
    enableExpandAll: false,
    // hides header for expand column
    displayColumnDefOptions: {
      "mrt-row-expand": {
        header: "",
      },
    },
    initialState: {
      density: "compact",
      sorting: [{ id: "updatedOn", desc: true }],
    },
    renderEmptyRowsFallback: () => <EmptyComponent />,
    renderDetailPanel: ({ row }) => {
      const note = row?.original?.note;
      return note ? (
        <Typography variant="caption" fontStyle="italic">
          {row?.original?.note}
        </Typography>
      ) : null;
    },
    renderRowActions: ({ row }) => (
      <Box>
        <Tooltip title="Mark pending">
          <IconButton
            size="small"
            disabled={isSelectionDisabled(
              MaintenanceRecordEnumValues.Pending,
              row?.original?.status,
            )}
            onClick={() =>
              toggleDialog(
                AddMaintenanceRecordPendingResolutionString,
                row?.original?.id,
                MaintenanceRecordEnumValues.Pending,
              )
            }
          >
            <PendingActionsOutlined fontSize="small" color="info" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Mark In Progress">
          <IconButton
            size="small"
            disabled={isSelectionDisabled(
              MaintenanceRecordEnumValues.Inprogress,
              row?.original?.status,
            )}
            onClick={() =>
              toggleDialog(
                AddMaintenanceRecordCompletedResolutionString,
                row?.original?.id,
                MaintenanceRecordEnumValues.Inprogress,
              )
            }
          >
            <EditAttributesOutlined fontSize="small" color="secondary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Mark completed">
          <IconButton
            size="small"
            disabled={isSelectionDisabled(
              MaintenanceRecordEnumValues.Completed,
              row?.original?.status,
            )}
            onClick={() =>
              toggleDialog(
                AddMaintenanceRecordRemovedResolutionString,
                row?.original?.id,
                MaintenanceRecordEnumValues.Completed,
              )
            }
          >
            <TaskAltOutlined fontSize="small" color="success" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.transparent.main,
    }),
    muiExpandButtonProps: ({ row }) => ({
      children: row.getIsExpanded() ? (
        <Remove sx={{ height: "0.875rem", width: "0.875rem" }} />
      ) : (
        <CommentRounded sx={{ height: "0.875rem", width: "0.875rem" }} />
      ),
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: "16rem",
        boxShadow: "none",
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        boxShadow: "none",
      },
    },
  });

  return (
    <Stack spacing={2}>
      <MaterialReactTable table={table} />
      <Dialog
        open={dialog.display}
        keepMounted
        fullWidth
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          <UpdateMaintenanceItemStatus
            id={dialog?.id}
            closeDialog={closeDialog}
            propertyName={propertyName}
            primaryTenantEmail={primaryTenantEmail}
            status={dialog?.status || ""}
          />
        </DialogContent>
        <DialogActions>
          <AButton
            size="small"
            variant="outlined"
            onClick={closeDialog}
            label="Close"
          />
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default ViewMaintenanceRecord;
