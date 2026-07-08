import React, { useMemo, useState } from "react";

import dayjs from "dayjs";

import {
  CommentRounded,
  HighlightOffOutlined,
  OpenInNewRounded,
  Remove,
} from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AIconButton from "common/AIconButton";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateMaintenanceDetails from "features/Rent/components/Maintenance/UpdateMaintenanceDetails";
import { MaintenanceRecordEnumValues } from "features/Rent/constants";
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
  display: false,
};

const ViewMaintenanceRecord = ({
  data = [],
  property,
  isPropertyOwner,
  primaryTenantEmail,
}) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [dialog, setDialog] = useState(DefaultDialogProps);

  const closeDialog = () => {
    setDialog(DefaultDialogProps);
  };

  const handleOpenMaintenanceForm = (row) => {
    const rowId = row?.original?.id;
    const status = row?.original?.status;
    setDialog({
      title: `Current status: ${status}`,
      id: rowId,
      status: status,
      display: true,
    });
  };

  const isSelectedItemCompleted =
    dialog?.status === MaintenanceRecordEnumValues.Completed;

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
        Cell: ({ cell, row }) =>
          cell?.getValue() ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                size="small"
                label={cell.getValue()}
                color="primary"
                sx={{
                  fontSize: "0.785rem",
                  paddingBottom: "0.2rem",
                  borderRadius: 0.5,
                }}
              />
              <OpenInNewRounded
                color="secondary"
                sx={{ width: "1.175rem", cursor: "pointer" }}
                onClick={() => handleOpenMaintenanceForm(row)}
              />
            </Stack>
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
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">
            {cell.getValue()
              ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")
              : "-"}
          </Typography>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data,
    enableColumnActions: false,
    enableTopToolbar: false,
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
      {dialog?.id ? (
        <Dialog
          open={dialog.display}
          keepMounted
          fullWidth
          maxWidth="md"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography variant="subtitle2">
                  Update maintenance status
                </Typography>
                <Typography variant="caption">{dialog.title}</Typography>
              </Stack>
              <AIconButton
                size="small"
                color="error"
                variant="outlined"
                onClick={closeDialog}
                label={<HighlightOffOutlined />}
              />
            </Stack>
          </DialogTitle>
          <DialogContent>
            <UpdateMaintenanceDetails
              id={dialog?.id}
              property={property}
              closeDialog={closeDialog}
              isPropertyOwner={isPropertyOwner}
              status={dialog?.status}
              isComplete={isSelectedItemCompleted}
              primaryTenantEmail={primaryTenantEmail}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default ViewMaintenanceRecord;
