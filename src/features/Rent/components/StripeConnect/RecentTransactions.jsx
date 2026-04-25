import React, { useMemo } from "react";

import dayjs from "dayjs";

import { Skeleton, Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table/dist";

dayjs.extend(relativeTime);

export default function RecentTransactions({ transactions = [], loading }) {
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => {
          const name = row.payment_method?.billing_details?.name;
          const email = row.payment_method?.billing_details?.email;

          if (!name && !email) return "-";
          return (
            <Typography variant="caption">{`${name || "Unknown"} (${email || "No email"})`}</Typography>
          );
        },
        id: "customer",
        header: "Customer",
        size: 250,
      },
      {
        accessorKey: "amount",
        header: "Transaction Amount",
        size: 200,
        Cell: ({ cell }) => {
          const cellValue = cell?.getValue();
          return (
            <Typography variant="caption">
              {cellValue ? `$${(cellValue / 100)?.toFixed(2)}` : "-"}
            </Typography>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Payment Status",
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="caption" textTransform="capitalize">
            {cell.getValue() ? cell.getValue() : "-"}
          </Typography>
        ),
      },
      {
        accessorFn: (row) => {
          const typeOfPayment = row.payment_method?.type;

          if (!typeOfPayment) return "-";
          return (
            <Typography variant="caption" textTransform="capitalize">
              {`${typeOfPayment || "Unknown"}`}
            </Typography>
          );
        },
        header: "Payment Method",
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="caption" textTransform="capitalize">
            {cell?.getValue() ? cell?.getValue() : "-"}
          </Typography>
        ),
      },
      {
        accessorKey: "created",
        header: "Last updated at",
        size: 200,
        Cell: ({ cell }) => {
          const cellValue = cell?.getValue();
          return (
            <Typography variant="caption" textTransform="capitalize">
              {cellValue
                ? `${dayjs(cellValue * 1000).format("hh:mm MM-DD-YYYY")}`
                : "-"}
            </Typography>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: transactions,
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
    renderEmptyRowsFallback: () => (
      <EmptyComponent caption="Create templates to begin." />
    ),
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.transparent.main,
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

  if (loading) return <Skeleton height="10rem" />;

  return (
    <Stack spacing={2}>
      <RowHeader
        title="Recent Transactions"
        caption="View recent transactions"
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
      />
      <MaterialReactTable table={table} />
    </Stack>
  );
}
