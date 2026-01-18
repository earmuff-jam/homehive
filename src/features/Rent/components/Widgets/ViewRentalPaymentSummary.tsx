import React, { useMemo } from "react";

import dayjs from "dayjs";

import { Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import { TRentRecordPayload } from "features/Rent/Rent.types";
import { formatCurrency, sumCentsToDollars } from "features/Rent/utils";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

// TViewRentalPaymentSummaryProps ...
type TViewRentalPaymentSummaryProps = {
  rentData?: TRentRecordPayload[];
};

const ViewRentalPaymentSummary: React.FC<TViewRentalPaymentSummaryProps> = ({
  rentData = [],
}) => {
  const columns = useMemo<MRT_ColumnDef<TRentRecordPayload>[]>(
    () => [
      {
        accessorKey: "tenantEmail",
        header: "Tenant Email",
        size: 200,
        Cell: ({ cell }) => (
          <Typography>{cell.getValue<string>() ?? "-"}</Typography>
        ),
      },
      {
        id: "amountPaid",
        header: "Amount Paid ($)",
        accessorFn: (row) => sumCentsToDollars(row.rent, row.additionalCharges),
        Cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      },
      {
        accessorKey: "method",
        header: "Payment Method",
        size: 100,
        Cell: ({ cell }) => cell.getValue<string>() ?? "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        Cell: ({ cell }) => cell.getValue<string>() ?? "-",
      },
      {
        accessorKey: "rentMonth",
        header: "Rent Month",
        size: 100,
        Cell: ({ cell }) => cell.getValue<string>() ?? "-",
      },
      {
        accessorKey: "updatedOn",
        header: "Updated On",
        size: 150,
        Cell: ({ cell }) =>
          cell.getValue()
            ? dayjs(cell.getValue<string | Date>()).format(
                "YYYY-MM-DD HH:mm:ss",
              )
            : "-",
      },
    ],
    [],
  );

  const table = useMaterialReactTable<TRentRecordPayload>({
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
