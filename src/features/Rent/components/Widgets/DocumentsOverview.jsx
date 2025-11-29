import React from "react";

import { AddRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import RowHeader from "common/RowHeader/RowHeader";
import ViewDocuments from "features/Rent/components/Widgets/ViewDocuments";

export default function DocumentsOverview({
  isPropertyLoading,
  property,
  dataTour,
}) {
  const theme = useTheme();
  const lteMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const uploadDoc = () => {};

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ margin: "0rem 0rem 1rem 0rem" }}
        >
          <RowHeader
            title="Documents Overview"
            caption={`View documents assoicated with ${property?.name}`}
            sxProps={{ textAlign: "left", color: "text.secondary" }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Upload Document">
              <Box>
                {lteMedFormFactor ? (
                  <AIconButton
                    size="small"
                    variant="outlined"
                    disabled
                    label={<AddRounded fontSize="small" />}
                    onClick={uploadDoc}
                  />
                ) : (
                  <AButton
                    disabled
                    size="small"
                    variant="outlined"
                    onClick={uploadDoc}
                    label="Upload Document"
                  />
                )}
              </Box>
            </Tooltip>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          {isPropertyLoading ? <Skeleton height="5rem" /> : <ViewDocuments />}
        </Stack>
      </CardContent>
    </Card>
  );
}
