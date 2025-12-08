import React, { useMemo } from "react";

import dayjs from "dayjs";

import {
  RemoveCircleOutlineRounded,
  UpgradeRounded,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

export default function EsignTemplateDetails({
  templates = [],
  handleDeleteRow,
  isDeleteRowLoading,
  createEsignFromExistingTemplate,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Template Name",
        size: 200,
        Cell: ({ cell, row }) => (
          <Typography
            variant="subtitle2"
            sx={{
              cursor: dayjs().isAfter(
                dayjs(row?.original?.document_url_expires_at),
              )
                ? "inherit"
                : "pointer",
            }}
            color={
              dayjs().isAfter(dayjs(row?.original?.document_url_expires_at))
                ? "textDisabled"
                : "success"
            }
            onClick={() =>
              // only perform action if document is not expired
              !dayjs().isAfter(dayjs(row?.original?.document_url_expires_at))
                ? window.open(
                    row.original.document_url,
                    "_blank",
                    "noopener,noreferrer",
                  )
                : null
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
        Cell: ({ cell, row }) => (
          <Typography
            variant="subtitle2"
            color={
              dayjs().isAfter(dayjs(row?.original?.document_url_expires_at))
                ? "textDisabled"
                : "success"
            }
          >
            {cell.getValue() ? cell.getValue() : "-"}
          </Typography>
        ),
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
    enableRowActions: true,
    renderRowActions: ({ row }) => [
      <Box
        key={row?.id}
        sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
      >
        <Tooltip title="Create E-sign">
          <IconButton
            size="small"
            loading={isDeleteRowLoading}
            onClick={() => createEsignFromExistingTemplate(row?.original)}
          >
            <UpgradeRounded fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Template">
          <IconButton
            size="small"
            loading={isDeleteRowLoading}
            onClick={() => handleDeleteRow(row?.original?.id)}
          >
            <RemoveCircleOutlineRounded fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      </Box>,
    ],
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
}
