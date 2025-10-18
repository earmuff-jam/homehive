import React, { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader/RowHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import { noramlizeDetailsTableData } from "features/Invoice/utils/utils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

const DetailsTableView = ({ label, caption }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const draftData = JSON.parse(localStorage.getItem("pdfDetails"));
    const draftInvoiceStatus = JSON.parse(
      localStorage.getItem("invoiceStatus"),
    );

    let formattedData;
    formattedData = { ...draftData };

    if (draftInvoiceStatus) {
      formattedData = {
        ...formattedData,
        invoice_status: draftInvoiceStatus?.label,
      };
    }

    if (draftData) {
      const data = noramlizeDetailsTableData([formattedData]);
      setTableData(data);
    }
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
        accessorKey: "start_date",
        header: "Start Month",
        size: 150,
      },
      {
        accessorKey: "end_date",
        header: "End Month",
        size: 150,
      },
      {
        accessorKey: "total",
        header: "Total Collected",
        size: 150,
        Cell: ({ cell }) => `$${cell.getValue()}`,
      },
      {
        accessorKey: "invoice_status",
        header: "Invoice Status",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "-"),
      },
      {
        accessorKey: "payment_method",
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
