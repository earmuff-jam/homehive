import React from "react";

import { PersonAddRounded } from "@mui/icons-material";
import {
  Badge,
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
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import Tenants from "features/Rent/components/Widgets/Tenants";

export default function TenantsOverview({
  property,
  tenants = [],
  isTenantsLoading,
  refetchGetProperty,
  toggleAssociateTenantsPopup,
  dataTour,
}) {
  const theme = useTheme();
  const ltMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ margin: "0rem 0rem 1rem 0rem" }}
        >
          <RowHeader
            title="Tenants"
            caption={`Active tenants for ${property?.name}`}
            sxProps={{
              textAlign: "left",
              color: "text.secondary",
            }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Associate tenants">
              <Badge badgeContent={tenants.length} color="error">
                <Box>
                  {ltMedFormFactor ? (
                    <AIconButton
                      size="small"
                      variant="outlined"
                      label={<PersonAddRounded fontSize="small" />}
                      onClick={() => toggleAssociateTenantsPopup()}
                    />
                  ) : (
                    <AButton
                      size="small"
                      variant="outlined"
                      onClick={() => toggleAssociateTenantsPopup()}
                      label="Associate tenants"
                    />
                  )}
                </Box>
              </Badge>
            </Tooltip>
          </Stack>
        </Stack>
        {isTenantsLoading ? (
          <Skeleton height="5rem" />
        ) : tenants.length === 0 ? (
          <EmptyComponent caption="Associate tenants to begin." />
        ) : (
          <Tenants
            tenants={tenants || []}
            property={property}
            refetchGetProperty={refetchGetProperty}
          />
        )}
      </CardContent>
    </Card>
  );
}
