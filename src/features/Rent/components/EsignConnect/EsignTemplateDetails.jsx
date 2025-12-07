import React, { useMemo } from "react";

import dayjs from "dayjs";

import { Box, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

export default function EsignTemplateDetails({ templates = [] }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Template Name",
        size: 200,
        Cell: ({ cell, row }) => (
          <Typography
            variant="subtitle2"
            sx={{ cursor: "pointer" }}
            onClick={() =>
              window.open(
                row.original.document_url,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            {cell.getValue() ? cell.getValue() : "-"}
          </Typography>
        ),
      },
      {
        accessorKey: "description",
        header: "Template Description",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "-"),
      },
      {
        accessorKey: "document_url_expires_at",
        header: "Expires in",
        size: 100,
        Cell: ({ cell }) => dayjs(cell.getValue()).fromNow(),
      },
      {
        accessorKey: "updated_date",
        header: "Last updated",
        size: 150,
        Cell: ({ cell }) => dayjs(cell.getValue()).fromNow(),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: templates,
    enableColumnActions: false,
    enableTopToolbar: false,
    enablePagination: templates?.length > 0,
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
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
}
