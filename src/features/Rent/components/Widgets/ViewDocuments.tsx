import { useMemo, useState } from "react";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import { TDocumentRow } from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

// TODO : https://github.com/earmuff-jam/invoicer/issues/77
// Fetch data from S3 / wherever we store docusign stuffs.
const ViewDocuments = ({ label, caption }) => {
  const [tableData] = useState<TDocumentRow[]>([]);

  const columns = useMemo<MRT_ColumnDef<TDocumentRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 40,
        Cell: ({ cell }) => cell.getValue<string>() ?? "-",
      },
      {
        accessorKey: "fileName",
        header: "Attachment Filename",
        size: 200,
        Cell: ({ cell }) => cell.getValue<string>() ?? "-",
      },
      {
        accessorKey: "updatedOn",
        header: "Last Updated",
        size: 150,
        Cell: ({ cell }) =>
          cell.getValue()
            ? dayjs(cell.getValue<string | Date>()).fromNow()
            : "-",
      },
    ],
    [],
  );

  const table = useMaterialReactTable<TDocumentRow>({
    columns,
    data: tableData,
    enableColumnActions: false,
    enableTopToolbar: false,
    initialState: {
      density: "comfortable",
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

  return (
    <Stack spacing={2}>
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

export default ViewDocuments;
