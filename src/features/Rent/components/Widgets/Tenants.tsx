import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import {
  CalendarTodayRounded,
  LockClockRounded,
  PersonRounded,
  RemoveCircleOutlineRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import { useUpdateTenantByIdMutation } from "features/Api/tenantsApi";
import { TProperty } from "features/Rent/Rent.schema";
import { TPropertyUpdateApiRequest, TTenant } from "features/Rent/Rent.types";
import {
  UpdatePropertyApiRequestEnumValue,
  formatCurrency,
} from "features/Rent/utils";
import { TUser } from "src/types";

// TTenantProps ...
type TTenantProps = {
  tenants?: TTenant[];
  property: TProperty;
};

const Tenants = ({ tenants = [], property }: TTenantProps) => {
  const user: TUser = fetchLoggedInUser();
  const [updateTenant, updateTenantRes] = useUpdateTenantByIdMutation();
  const [updateProperty, updatePropertyRes] = useUpdatePropertyByIdMutation();

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const sortedByPrimaryStatus = (arr: TTenant[]) => {
    return [...arr].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  };

  const handleRemoveAssociatedTenant = (
    ev: React.MouseEvent<HTMLButtonElement>,
    tenant: TTenant,
  ) => {
    ev.preventDefault();
    if (!tenant?.id) return;
    updateTenant({
      id: tenant.id,
      newData: {
        isActive: false,
        updatedBy: user?.uid,
        updatedOn: dayjs().toISOString(),
      },
    });
  };

  useEffect(() => {
    if (updateTenantRes.isSuccess) {
      const filteredRentees = property?.rentees?.filter(
        (rentee) => rentee !== updateTenantRes.data.email,
      );
      const request: TPropertyUpdateApiRequest = {
        property: {
          ...property,
          rentees: filteredRentees,
          updatedBy: user.uid,
          updatedOn: dayjs().toISOString(),
        },
        action: UpdatePropertyApiRequestEnumValue,
      };
      updateProperty(request);
    }
  }, [updateTenantRes.isLoading]);

  useEffect(() => {
    if (updatePropertyRes.isSuccess) {
      setShowSnackbar(true);
    }
  }, [updatePropertyRes.isLoading]);

  return (
    <Stack spacing={1} maxHeight="22rem" overflow="auto">
      {sortedByPrimaryStatus(tenants).map((tenant) => (
        <Stack key={tenant.id}>
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              {/* Header with Avatar and Primary Badge */}
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2.5 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                  {tenant.email.charAt(0).toUpperCase()}
                </Avatar>

                <Stack sx={{ ml: 2, flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.2rem",
                    }}
                  >
                    <Tooltip title={tenant.email}>
                      <Typography
                        flexGrow={1}
                        variant="subtitle2"
                        color="primary"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 150,
                        }}
                      >
                        {tenant.email}
                      </Typography>
                    </Tooltip>

                    {tenant?.isSoR && (
                      <Tooltip title="Single occupancy room rentee">
                        <LockClockRounded fontSize="small" />
                      </Tooltip>
                    )}
                  </Box>

                  <Box>
                    <Chip
                      label={
                        tenant?.isPrimary
                          ? "Primary Renter"
                          : "Secondary Renter"
                      }
                      size="small"
                      color={tenant?.isPrimary ? "primary" : "default"}
                      sx={{ height: 24, fontSize: "0.75rem", fontWeight: 500 }}
                    />
                  </Box>
                </Stack>

                <Tooltip title="Remove tenant from property">
                  <IconButton
                    size="small"
                    onClick={(ev) => handleRemoveAssociatedTenant(ev, tenant)}
                  >
                    <RemoveCircleOutlineRounded
                      fontSize="small"
                      color="error"
                    />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Rent Highlight */}
              <Paper
                elevation={0}
                sx={{ p: "1rem", bgcolor: "background.default" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  {tenant?.isPrimary && (
                    <Stack>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "2rem" }}
                        color="textSecondary"
                      >
                        {formatCurrency(tenant.rent + property.additionalRent)}
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        Monthly Rent
                      </Typography>
                    </Stack>
                  )}

                  <Stack>
                    <CalendarTodayRounded fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      LEASE TERM
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {tenant.term}
                    </Typography>
                  </Stack>

                  <Stack>
                    <PersonRounded fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      START DATE
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {tenant.startDate
                        ? dayjs(tenant.startDate).format("MMM DD, YYYY")
                        : "-"}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Stack>
      ))}

      <CustomSnackbar
        severity="success"
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default Tenants;
