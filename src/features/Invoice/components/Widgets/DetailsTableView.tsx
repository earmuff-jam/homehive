import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import RowHeader from "features/Invoice/components/RowHeader/InvoiceRowHeader";
import {
  Invoice,
  InvoiceRow,
  TInvoiceStatusOption,
} from "features/Invoice/types/Invoice.types";
import {
  normalizeDetailsTableData,
  parseJsonUtility,
} from "features/Invoice/utils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

// DetailsTableViewProps ...
type DetailsTableViewProps = {
  label: string;
  caption: string;
};

const DetailsTableView = ({ label, caption }: DetailsTableViewProps) => {
  const [tableData, setTableData] = useState<InvoiceRow[]>([]);

  useEffect(() => {
    const draftData = parseJsonUtility<Invoice>(
      localStorage.getItem("pdfDetails"),
    );
    const invoiceStatus = parseJsonUtility<{
      invoiceStatus: TInvoiceStatusOption;
    }>(localStorage.getItem("invoiceStatus"));

    const formattedData: Invoice = {
      ...draftData,
      ...(invoiceStatus && {
        invoiceStatus: invoiceStatus?.invoiceStatus,
      }),
    };

    setTableData(normalizeDetailsTableData([formattedData]));
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Invoice Type",
        size: 200,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "-"),
      },
      {
        accessorKey: "startDate",
        header: "Start Month",
        Cell: ({ cell }) =>
          cell.getValue() ? dayjs(cell.getValue()).format("MM-DD-YYYY") : "-",
        size: 150,
      },
      {
        accessorKey: "endDate",
        header: "End Month",
        Cell: ({ cell }) =>
          cell.getValue() ? dayjs(cell.getValue()).format("MM-DD-YYYY") : "-",
        size: 150,
      },
      {
        accessorKey: "total",
        header: "Total Collected",
        size: 150,
        Cell: ({ cell }) => `$${cell.getValue()}`,
      },
      {
        accessorKey: "invoiceStatus",
        header: "Invoice Status",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue()?.label : "-"),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment method",
        size: 150,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "-"),
      },
      {
        accessorKey: "updatedOn",
        header: "Updated on",
        size: 150,
        Cell: ({ cell }) => dayjs(cell.getValue()).fromNow(),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableColumnActions: false,
    enableTopToolbar: false,
    enablePagination: tableData?.length > 0,
    initialState: {
      density: "comfortable",
    },
    renderEmptyRowsFallback: () => <EmptyComponent />,
    mrtTheme: {
      baseBackgroundColor: "rgba(0, 0, 0, 0)", // todo: fix theme for ts to move to transparent bg color
    },
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
    <Stack spacing={2} data-tour={"dashboard-7"}>
      <RowHeader
        title={label}
        caption={caption}
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
      />
      <MaterialReactTable table={table} />
    </Stack>
  );
};

export default DetailsTableView;
