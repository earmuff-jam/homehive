import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  CheckCircleOutlineRounded,
  EmailRounded,
  ExpandMoreRounded,
  MoneyOffCsredRounded,
  PaidRounded,
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
import {
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
  derieveTotalRent,
  getColorAndLabelForCurrentMonth,
  getNextMonthlyDueDate,
  updateDateTime,
} from "features/RentWorks/common/utils";
import QuickConnectMenu from "features/RentWorks/components/QuickConnect/QuickConnectMenu";
import { handleQuickConnectAction } from "features/RentWorks/components/Settings/TemplateProcessor";
import { DefaultTemplateData } from "features/RentWorks/components/Templates/constants";
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

  const primaryTenantDetails =
    tenants?.find((tenant) => tenant.isPrimary) || tenants[0];

  const isAnyPropertySoR = tenants?.some((tenant) => tenant.isSoR);

  const handleCloseQuickConnect = () => setAnchorEl(null);
  const handleOpenQuickConnect = (ev) => setAnchorEl(ev.currentTarget);

  const currentMonthRent = rentDetails?.find(
    (rent) =>
      rent.rentMonth === dayjs().format("MMMM") &&
      (PaidRentStatusEnumValue ||
        ManualRentStatusEnumValue === rent.status?.toLowerCase()),
  );

  const { color: statusColor, label: statusLabel } =
    getColorAndLabelForCurrentMonth(
      primaryTenantDetails?.start_date,
      currentMonthRent,
      Number(primaryTenantDetails?.grace_period),
    );

  const handleQuickConnectMenuItem = (
    action,
    property,
    primaryTenantDetails,
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
      getNextMonthlyDueDate(primaryTenantDetails?.start_date),
      primaryTenantDetails,
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
    <Stack spacing={2}>
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
        <Stack direction="row" spacing={2} flexWrap="wrap" flex={1}>
          <Avatar sx={{ bgcolor: "primary.main", mt: 0.5 }}>
            {primaryTenantDetails?.first_name ||
              primaryTenantDetails?.googleDisplayName ||
              "U"}
          </Avatar>
          <Stack flexGrow={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {primaryTenantDetails?.first_name ||
                  primaryTenantDetails?.googleDisplayName ||
                  primaryTenantDetails?.email}
              </Typography>
              <Tooltip title="Primary point of contact">
                <CheckCircleOutlineRounded color="primary" fontSize="small" />
              </Tooltip>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-around"
              padding={1}
            >
              <Stack textAlign="center">
                <Typography
                  variant="subtitle2"
                  fontSize="1.875rem"
                  color="primary"
                >
                  ${primaryTenantDetails?.rent}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Monthly Rent
                </Typography>
              </Stack>
              <Stack textAlign="center">
                <Typography variant="subtitle2" fontSize="2rem" color="primary">
                  {dayjs(
                    updateDateTime(
                      dayjs(primaryTenantDetails?.start_date || ""),
                    ),
                  ).format("MMM DD")}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Next payment due date
                </Typography>
              </Stack>
            </Stack>

            <Box>
              <Chip
                icon={
                  primaryTenantDetails?.isPaid ? (
                    <PaidRounded />
                  ) : (
                    <MoneyOffCsredRounded />
                  )
                }
                label={statusLabel}
                size="small"
                color={statusColor}
                sx={{ mt: 1 }}
              />
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
                {primaryTenantDetails?.phone}
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
                {primaryTenantDetails?.email}
              </Typography>
              <Tooltip title="Send Email">
                <IconButton
                  size="small"
                  href={`mailto:${primaryTenantDetails?.email}`}
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
                  primaryTenantDetails,
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
