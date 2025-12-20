import React, { useMemo } from "react";

import { UpgradeRounded } from "@mui/icons-material";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import AButton from "common/AButton";
import EmptyComponent from "common/EmptyComponent";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

export default function EsignTemplateDetails({
  templates = [],
  isViewingRental,
  createEsignFromExistingTemplate,
  isCreateEsignFromTemplateLoading,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Template Name",
        Cell: ({ cell }) => (
          <Typography variant="subtitle2" color="success">
            {cell.getValue() ? cell.getValue() : "-"}
          </Typography>
        ),
      },
      {
        accessorKey: "-",
        header: "Signing parties",
        Cell: ({ row }) => {
          const signers = row?.original?.signers ?? [];

          const toChipLabels = (label, idx) => (
            <Chip
              key={`${label}-${idx}`}
              size="small"
              label={label}
              color={idx % 2 ? "secondary" : "primary"}
            />
          );

          return (
            <Box display="flex" gap={1}>
              {signers.map(({ template_rolename }, idx) =>
                toChipLabels(template_rolename, idx),
              )}
            </Box>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: templates,
    enableTopToolbar: false,
    enableSorting: false,
    enableColumnActions: false,
    enablePagination: templates?.length > 0,
    initialState: {
      density: "comfortable",
    },
    renderEmptyRowsFallback: () => (
      <EmptyComponent caption="Default templates are currently unavailable." />
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
    enableRowActions: !isViewingRental, // property owners can perform actions on templates
    renderRowActions: ({ row }) => [
      <Box
        key={row?.id}
        sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}
      >
        <Tooltip title="Create E-sign">
          <AButton
            size="small"
            label="Prepare"
            variant="outlined"
            loading={isCreateEsignFromTemplateLoading}
            onClick={() => createEsignFromExistingTemplate(row?.original)}
            startIcon={<UpgradeRounded fontSize="small" color="primary" />}
          />
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
