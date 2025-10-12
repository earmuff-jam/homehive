import React, { useMemo } from "react";

import dayjs from "dayjs";

import { Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  formatCurrency,
  sumCentsToDollars,
} from "features/Rent/utils/utils";
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
        Cell: ({ cell }) => <Typography>{cell.getValue()}</Typography> || "-",
      },
      {
        header: "Amount Paid ($)",
        accessorFn: (row) =>
          sumCentsToDollars(
            row?.rentAmount,
            row?.additionalCharges,
            row?.initialLateFee,
            row?.dailyLateFee,
          ),
        id: "amountPaid",
        Cell: ({ cell }) => formatCurrency(cell.getValue()),
      },
      {
        accessorKey: "method",
        header: "Payment Method",
        size: 100,
        Cell: ({ cell }) => cell.getValue() || "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => cell.getValue() || "-",
      },
      {
        accessorKey: "rentMonth",
        header: "Rent Month",
        size: 100,
        Cell: ({ cell }) => cell.getValue() || "-",
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
    data: rentData,
    enableColumnActions: false,
    enableTopToolbar: false,
    initialState: {
      density: "compact",
      sorting: [{ id: "updatedOn", desc: true }],
    },
    renderEmptyRowsFallback: () => <EmptyComponent />,
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

  return (
    <Stack spacing={2}>
      <MaterialReactTable table={table} />
    </Stack>
  );
};

export default ViewRentalPaymentSummary;
