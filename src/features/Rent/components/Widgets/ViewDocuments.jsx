import React, { useMemo, useState } from "react";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader/RowHeader";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

// TODO : https://github.com/earmuff-jam/invoicer/issues/77
// Fetch data from S3 / wherever we store docusign stuffs.
const ViewDocuments = ({ label, caption }) => {
  const [tableData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 40,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "-"),
      },
      {
        accessorKey: "fileName",
        header: "Attachment Filename",
        size: 200,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "-"),
      },

      {
        accessorKey: "updatedOn",
        header: "Last updated",
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
