import React, { useState } from "react";

import dayjs from "dayjs";

import {
  AutorenewOutlined,
  CalendarTodayRounded,
  LockRounded,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import { useUpdateTenantByIdMutation } from "features/Api/tenantsApi";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";
import { formatCurrency } from "features/Rent/utils";

export default function Tenants({ tenants = [], property }) {
  const theme = useTheme();
  const user = fetchLoggedInUser();
  const [updateTenant] = useUpdateTenantByIdMutation();
  const [updateProperty] = useUpdatePropertyByIdMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const smallFormFactorGt = useMediaQuery(theme.breakpoints.up("sm"));
  const { nextPaymentDueDate } = useSelectedPropertyDetails(property, tenants);

  const sortedByPrimaryStatus = (arr) => {
    return [...arr].sort((a, b) => b.isPrimary - a.isPrimary);
  };

  const handleRemoveAssociatedTenant = async (ev, tenant) => {
    ev.preventDefault();

    if (!tenant?.id) return;

    const filteredRentees = property?.rentees.filter(
      (rentee) => rentee !== tenant.email,
    );

    await updateTenant({
      id: tenant?.id,
      newData: {
        isActive: false,
        updatedBy: user?.uid,
        updatedOn: dayjs().toISOString(),
      },
    });

    await updateProperty({
      ...property,
      id: property?.id,
      rentees: filteredRentees,
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });

    setShowSnackbar(true);
  };

  return (
    <Stack spacing={1} maxHeight="22rem" overflow="auto">
      {sortedByPrimaryStatus(tenants)?.map((tenant) => (
        <Stack key={tenant?.id}>
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ p: 1 }}>
              {/* Header with Avatar and Primary Badge */}
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2.5 }}>
                {smallFormFactorGt ? (
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {tenant.email.charAt(0).toUpperCase()}
                  </Avatar>
                ) : null}
                <Stack sx={{ ml: 2, flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "0.2rem",
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      {tenant.email}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {tenant?.isSoR && (
                      <Tooltip title="Single occupancy room rentee">
                        <LockRounded fontSize="small" color="warning" />
                      </Tooltip>
                    )}
                    {!tenant?.isSoR && (
                      <Tooltip title="Autorenew lease extension is on">
                        <AutorenewOutlined fontSize="small" color="info" />
                      </Tooltip>
                    )}
                    <Box>
                      <Chip
                        label={
                          tenant?.isPrimary
                            ? "Primary Renter"
                            : "Secondary Renter"
                        }
                        size="small"
                        color={tenant?.isPrimary ? "primary" : "background"}
                        sx={{
                          height: 24,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    <Box>
                      <Tooltip title="Next payment due date">
                        <Chip
                          label={dayjs(nextPaymentDueDate).format("DD MMMM")}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Stack>
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
                sx={{
                  padding: 1,
                  bgcolor: "background.default",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "space-around",
                  }}
                  flexDirection={{ xs: "column", md: "row" }}
                >
                  {tenant?.isPrimary ? (
                    <Stack>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontSize: "2rem" }}
                        color="textSecondary"
                      >
                        {formatCurrency(
                          Number(tenant?.rent || 0) +
                            Number(property?.additionalRent || 0),
                        )}
                      </Typography>

                      <Typography variant="subtitle2" color="textSecondary">
                        Monthly Rent
                      </Typography>
                    </Stack>
                  ) : null}
                  <Stack>
                    <Box>
                      <CalendarTodayRounded fontSize="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      LEASE TERM
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {tenant.term}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Box>
                      <PersonRounded fontSize="small" />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      START DATE
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {dayjs(tenant?.startDate).format("MMM DD, YYYY")}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Stack>
      ))}

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
}
