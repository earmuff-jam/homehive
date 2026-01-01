import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  CheckCircleOutlineRounded,
  EmailRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import { useLazyGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import QuickConnectMenu from "features/Rent/components/QuickConnect/QuickConnectMenu";
import { handleQuickConnectAction } from "features/Rent/components/Settings/TemplateProcessor";
import { DefaultTemplateData } from "features/Rent/components/Templates/constants";
import {
  derieveTotalRent,
  getColorAndLabelForCurrentMonth,
  getNextMonthlyDueDate,
  getRentDetails,
  updateDateTime,
} from "features/Rent/utils";
import useSendEmail from "hooks/useSendEmail";

const ViewPropertyAccordionDetails = ({
  property,
  rentDetails,
  isRentDetailsLoading,
}) => {
  const navigate = useNavigate();
  const redirectTo = (path) => navigate(path);

  const { data: tenants = [], isLoading } = useGetTenantByPropertyIdQuery(
    property?.id,
    {
      skip: !property?.id,
    },
  );

  const [
    triggerGetUserData,
    { data: propertyOwnerData, isLoading: isUserDataLoading },
  ] = useLazyGetUserDataByIdQuery();

  const { sendEmail, reset, error, success } = useSendEmail();

  const [anchorEl, setAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);
  const currentMonthRent = getRentDetails(rentDetails);

  const isAnyPropertySoR = tenants?.some((tenant) => tenant.isSoR);
  const primaryTenant = tenants?.find((tenant) => tenant.isPrimary);

  const handleCloseQuickConnect = () => setAnchorEl(null);
  const handleOpenQuickConnect = (ev) => setAnchorEl(ev.currentTarget);

  const {
    color: statusColor,
    label: statusLabel,
    icon: statusIcon,
  } = getColorAndLabelForCurrentMonth(
    primaryTenant?.start_date,
    currentMonthRent,
    Number(primaryTenant?.grace_period),
  );

  const handleQuickConnectMenuItem = (
    action,
    property,
    primaryTenant,
    propertyOwnerData,
    redirectTo,
    sendEmail,
  ) => {
    const totalRent = derieveTotalRent(property, tenants, isAnyPropertySoR);

    let savedTemplates = {};
    savedTemplates = JSON.parse(localStorage.getItem("templates") || "{}");

    if (!savedTemplates || Object.keys(savedTemplates).length === 0) {
      savedTemplates = DefaultTemplateData;
    }

    handleQuickConnectAction(
      action,
      property,
      totalRent,
      getNextMonthlyDueDate(primaryTenant?.start_date),
      primaryTenant,
      propertyOwnerData,
      savedTemplates,
      redirectTo,
      sendEmail,
    );
  };

  if (isLoading || isRentDetailsLoading || isUserDataLoading)
    return <Skeleton height="10rem" />;

  if (!tenants || tenants.length === 0) {
    return <EmptyComponent caption="Add tenants to begin." />;
  }

  return (
    <Stack spacing={2} flexWrap="wrap">
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SECTION */}
        <Stack direction="row" spacing={2} flex={1}>
          <Avatar sx={{ bgcolor: "primary.main", mt: 0.5 }}>
            {primaryTenant?.first_name ||
              primaryTenant?.googleDisplayName ||
              "U"}
          </Avatar>
          <Stack flexGrow={1}>
            <Stack direction="row" spacing={1}>
              <Tooltip
                title={
                  primaryTenant?.first_name ||
                  primaryTenant?.googleDisplayName ||
                  primaryTenant?.email
                }
              >
                <Typography
                  flexGrow={1}
                  variant="body2"
                  color="primary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    alignContent: "center",
                    textOverflow: "ellipsis",
                    maxWidth: 150,
                  }}
                >
                  {primaryTenant?.first_name ||
                    primaryTenant?.googleDisplayName ||
                    primaryTenant?.email}
                </Typography>
              </Tooltip>
              <Tooltip title="Primary point of contact">
                <CheckCircleOutlineRounded color="primary" fontSize="small" />
              </Tooltip>
            </Stack>

            <Stack
              direction={{ md: "row", sm: "column" }}
              spacing={1}
              justifyContent="space-around"
              padding={1}
              textAlign="center"
            >
              <Stack>
                <Typography
                  variant="subtitle2"
                  fontSize="1.875rem"
                  color="primary"
                >
                  ${primaryTenant?.rent}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Monthly Rent
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2" fontSize="2rem" color="primary">
                  {dayjs(
                    updateDateTime(dayjs(primaryTenant?.start_date)),
                  ).format("MMM DD")}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Next payment due date
                </Typography>
              </Stack>
            </Stack>

            <Box>
              {statusLabel && (
                <Chip
                  size="small"
                  icon={statusIcon}
                  label={statusLabel}
                  color={statusColor}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Stack>
        </Stack>

        {/* RIGHT SECTION */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          minWidth={180}
          mt={{ xs: 2, sm: 0 }}
          justifyContent="flex-end"
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography
                flexGrow={1}
                variant="body2"
                color="primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  alignContent: "center",
                  textOverflow: "ellipsis",
                  maxWidth: 150,
                }}
              >
                {primaryTenant?.phone}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Typography
                flexGrow={1}
                variant="body2"
                color="primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  alignContent: "center",
                  textOverflow: "ellipsis",
                  maxWidth: 150,
                }}
              >
                {primaryTenant?.email}
              </Typography>
              <Tooltip title="Send Email">
                <IconButton
                  size="small"
                  href={`mailto:${primaryTenant?.email}`}
                  target="_blank"
                >
                  <EmailRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <AButton
              label="Quick Connect"
              disabled={tenants?.length <= 0}
              onClick={(e) => {
                e.stopPropagation();
                triggerGetUserData(property?.createdBy);
                handleOpenQuickConnect(e);
              }}
              size="small"
              variant="contained"
              endIcon={<ExpandMoreRounded />}
            />
            <QuickConnectMenu
              open={isOpen}
              anchorEl={anchorEl}
              property={property}
              onClose={handleCloseQuickConnect}
              onMenuItemClick={(action) =>
                handleQuickConnectMenuItem(
                  action,
                  property,
                  primaryTenant,
                  propertyOwnerData,
                  redirectTo,
                  sendEmail,
                )
              }
              openMaintenanceForm={(o) => o}
              openNoticeComposer={(o) => o}
            />
          </Stack>
        </Box>
      </Paper>
      <CustomSnackbar
        showSnackbar={success || error !== null}
        setShowSnackbar={reset}
        severity={success ? "success" : "error"}
        title={
          success
            ? "Email sent successfully. Check spam if necessary."
            : "Error sending email."
        }
      />
    </Stack>
  );
};

export default ViewPropertyAccordionDetails;
