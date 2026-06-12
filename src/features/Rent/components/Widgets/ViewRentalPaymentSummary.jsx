import React, { useMemo } from "react";

import dayjs from "dayjs";

import { CommentRounded, Remove } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatCurrency } from "features/Rent/utils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

const ViewRentalPaymentSummary = ({ rentData = [] }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "tenantEmail",
        header: "Tenant Email",
        size: 200,
        Cell: ({ cell }) =>
          <Typography variant="subtitle2">{cell.getValue()}</Typography> || "-",
      },
      {
        header: "Amount Paid ($)",
        accessorFn: (row) => {
          const total = [
            row?.rentAmount,
            row?.additionalCharges,
            row?.initialLateFee,
            row?.dailyLateFee,
          ].reduce((sum, val) => {
            const num = Number(val);
            return sum + (Number.isFinite(num) ? num : 0);
          }, 0);
          return total;
        },
        id: "amountPaid",
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">
            {formatCurrency(cell.getValue())}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Payment Method",
        size: 100,
        Cell: ({ cell }) =>
          (
            <Typography textTransform="capitalize" variant="subtitle2">
              {cell.getValue()}
            </Typography>
          ) || "-",
      },
      {
        accessorKey: "rentMonth",
        header: "Rent Month",
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">{cell.getValue() || "-"}</Typography>
        ),
      },
      {
        accessorKey: "updatedOn",
        header: "Updated on",
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">
            {cell.getValue()
              ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Typography>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: rentData,
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

export default ViewRentalPaymentSummary;
