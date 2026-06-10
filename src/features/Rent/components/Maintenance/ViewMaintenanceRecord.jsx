import React, { useMemo } from "react";

import dayjs from "dayjs";

import { CommentRounded, Remove } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

const ViewMaintenanceRecord = ({ data = [] }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "tenantEmail",
        header: "Tenant Email",
        size: 200,
        Cell: ({ cell }) => <Typography>{cell.getValue()}</Typography> || "-",
      },
      {
        header: "Category",
        accessorKey: "maintenanceCategory",
        id: "maintenanceCategory",
        Cell: ({ cell }) => cell?.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) =>
          (
            <Typography textTransform="capitalize">
              {cell.getValue()}
            </Typography>
          ) || "-",
      },
      {
        header: "Description",
        size: 200,
        accessorKey: "description",
        id: "description",
        Cell: ({ cell }) =>
          (
            <Tooltip title={cell?.getValue()}>
              <Typography noWrap sx={{ width: 200 }}>
                {cell.getValue()}
              </Typography>
            </Tooltip>
          ) || "-",
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
    </Stack>
  );
};

export default ViewMaintenanceRecord;
