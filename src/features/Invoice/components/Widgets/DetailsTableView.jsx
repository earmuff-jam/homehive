import React, { useMemo } from "react";

import dayjs from "dayjs";

import { CommentRounded, Remove } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import { noramlizeDetailsTableData } from "features/Invoice/utils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

const DetailsTableView = ({ data = {} }) => {
  const columns = [
    {
      accessorKey: "category",
      header: "Categories",
      size: 200,
      Cell: ({ cell }) => (cell?.getValue() ? cell.getValue() : "-"),
    },
    {
      accessorKey: "startDate",
      header: "Start Month",
      Cell: ({ cell }) =>
        cell?.getValue() ? dayjs(cell.getValue()).format("MM-DD-YYYY") : "-",
      size: 150,
    },
    {
      accessorKey: "endDate",
      header: "End Month",
      Cell: ({ cell }) =>
        cell?.getValue() ? dayjs(cell.getValue()).format("MM-DD-YYYY") : "-",
      size: 150,
    },
    {
      accessorKey: "total",
      header: "Total Collected",
      size: 150,
      Cell: ({ cell }) => `$${cell?.getValue()}`,
    },
    {
      accessorKey: "invoiceStatus",
      header: "Invoice Status",
      size: 100,
      Cell: ({ cell }) =>
        cell?.getValue()?.label ? cell.getValue()?.label : "-",
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment methods",
      size: 150,
      Cell: ({ cell }) => (cell?.getValue() ? cell.getValue() : "-"),
    },
    {
      accessorKey: "updatedOn",
      header: "Updated on",
      size: 150,
      Cell: ({ cell }) => dayjs(cell?.getValue()).fromNow(),
    },
  ];

  // protect from re-render
  const tableData = useMemo(() => noramlizeDetailsTableData([data]), [data]);

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableExpandAll: false,
    // hides header for expand column
    displayColumnDefOptions: {
      "mrt-row-expand": {
        header: "",
      },
    },
    enablePagination: tableData?.length > 0,
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
    <Stack spacing={2} data-tour="dashboard-7">
      <MaterialReactTable table={table} />
    </Stack>
  );
};

export default DetailsTableView;
