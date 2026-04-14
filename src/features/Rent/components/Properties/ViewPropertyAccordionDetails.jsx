import React, { useEffect, useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  CheckCircleOutlineRounded,
  CloseRounded,
  EmailRounded,
  ExpandMoreRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { SettingsRouteUri, fetchLoggedInUser } from "common/utils";
import {
  useAddressOneTimePaymentMutation,
  useSendEmailMutation,
} from "features/Api/externalIntegrationsApi";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import OnetimeChargeForm from "features/Rent/components/OnetimeCharge/OnetimeChargeForm";
import QuickConnectMenu from "features/Rent/components/QuickConnect/QuickConnectMenu";
import { handleQuickConnectAction } from "features/Rent/components/Settings/TemplateProcessor";
import { DefaultRentalAppEmailTemplates } from "features/Rent/components/Templates/constants";
import { useSelectedPropertyDetails } from "features/Rent/hooks/useGetSelectedPropertyDetails";
import {
  ManualRentStatusEnumValue,
  getColorAndLabelForCurrentMonth,
} from "features/Rent/utils";

// DefaultOneTimePaymentValues ...
// defines the default values for one time payment form
const DefaultOneTimePaymentValues = {
  amount: 0,
  note: "",
};

const ViewPropertyAccordionDetails = ({
  property,
  rentDetails,
  isRentDetailsLoading,
}) => {
  const navigate = useNavigate();
  const user = fetchLoggedInUser();
  const redirectTo = (path) => navigate(path);

  const { data: tenants = [], isLoading: isGetTenantsLoading } =
    useGetTenantByPropertyIdQuery(property?.id, {
      skip: !property?.id,
    });

  const [sendEmail, sendEmailResult] = useSendEmailMutation();
  const [addressOneTimePayment, addressOneTimePaymentResult] =
    useAddressOneTimePaymentMutation();

  const { data: propertyOwnerData } = useGetUserDataByIdQuery(
    property?.createdBy,
    {
      skip: !property?.createdBy,
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: DefaultOneTimePaymentValues,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [onetimeCharge, setOnetimeCharge] = useState(false);

  const isOpen = Boolean(anchorEl);
  const currentMonth = dayjs().format("MMMM");
  const currentMonthRent = rentDetails?.find(
    (rentDetail) => rentDetail.rentMonth === currentMonth,
  );

  const primaryTenant = tenants?.find((tenant) => tenant.isPrimary);

  const handleCloseOnetimePaymentForm = () => {
    reset(DefaultOneTimePaymentValues);
    setOnetimeCharge(false);
  };

  const handleCloseQuickConnect = () => setAnchorEl(null);
  const handleOpenQuickConnect = (ev) => setAnchorEl(ev.currentTarget);

  const { nextPaymentDueDate, totalRent } = useSelectedPropertyDetails(
    property,
    tenants,
  );

  const {
    color: statusColor,
    label: statusLabel,
    icon: statusIcon,
  } = getColorAndLabelForCurrentMonth(
    primaryTenant?.startDate,
    currentMonthRent,
    Number(primaryTenant?.gracePeriod),
  );

  const submit = (formData) => {
    addressOneTimePayment({
      propertyId: property?.id,
      propertyOwnerId: property?.createdBy,
      rentAmount: formData?.amount,
      rentMonth: dayjs().format("MMMM"),
      status: ManualRentStatusEnumValue,
      tenantEmail: primaryTenant?.email,
      tenantId: primaryTenant?.id,
      note: formData.note,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  const templates = useMemo(() => {
    const stored = localStorage.getItem("templates");
    return stored ? JSON.parse(stored) : DefaultRentalAppEmailTemplates;
  }, []);

  useEffect(() => {
    if (
      !addressOneTimePaymentResult.isLoading &&
      addressOneTimePaymentResult.isSuccess
    ) {
      handleCloseOnetimePaymentForm();
    }
  }, [addressOneTimePaymentResult.isLoading]);

  if (isGetTenantsLoading || isRentDetailsLoading)
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
            {primaryTenant?.firstName ||
              primaryTenant?.googleDisplayName ||
              "U"}
          </Avatar>
          <Stack flexGrow={1}>
            <Stack direction="row" spacing={1}>
              <Tooltip
                title={
                  primaryTenant?.firstName ||
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
                  {primaryTenant?.firstName ||
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
                  ${totalRent}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Monthly Rent
                </Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2" fontSize="2rem" color="primary">
                  {nextPaymentDueDate}
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
              type="button"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                handleOpenQuickConnect(ev);
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
                handleQuickConnectAction(
                  action,
                  property,
                  totalRent,
                  nextPaymentDueDate,
                  primaryTenant,
                  propertyOwnerData,
                  templates,
                  redirectTo,
                  sendEmail,
                  setOnetimeCharge,
                )
              }
            />
          </Stack>
        </Box>
      </Paper>
      <Dialog
        open={onetimeCharge}
        keepMounted
        fullWidth
        maxWidth="sm"
        aria-describedby="onetime-charge-dialog"
      >
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <RowHeader
                title="Request Payment"
                caption="Please fill out all the required fields"
                sxProps={{ textAlign: "left" }}
              />
            </Stack>
            <Box alignSelf="flex-end">
              <IconButton size="small" onClick={() => setOnetimeCharge(false)}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {propertyOwnerData?.stripeAccountIsActive ? (
            <>
              <Alert
                variant="standard"
                color="info"
                icon={<WarningAmberRounded fontSize="small" />}
              >
                <Typography
                  color="textSecondary"
                  fontStyle="italic"
                  sx={{ fontSize: "0.875rem" }}
                >
                  Bank transactions may take couple of business days to complete
                </Typography>
              </Alert>
              <OnetimeChargeForm register={register} errors={errors} />
            </>
          ) : (
            <EmptyComponent caption="Setup stripe to begin">
              <Typography
                component={"span"}
                variant="caption"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`${SettingsRouteUri}?tabIdx=2`)}
              >
                from here
              </Typography>
            </EmptyComponent>
          )}
        </DialogContent>
        <DialogActions>
          <AButton
            label="Maybe later"
            onClick={() => setOnetimeCharge(false)}
          />
          <AButton
            label="Send charge"
            variant="outlined"
            disabled={!isValid}
            loading={addressOneTimePaymentResult?.isLoading}
            onClick={handleSubmit(submit)}
          />
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        showSnackbar={sendEmailResult.isSuccess || sendEmailResult.isError}
        setShowSnackbar={() => {}}
        severity={sendEmailResult.isSuccess ? "success" : "error"}
        title={
          sendEmailResult.isSuccess
            ? "Email sent successfully. Check spam if necessary."
            : "Error sending email."
        }
      />
      <CustomSnackbar
        showSnackbar={
          addressOneTimePaymentResult.isSuccess ||
          addressOneTimePaymentResult.isError
        }
        setShowSnackbar={() => {}}
        severity={addressOneTimePaymentResult.isSuccess ? "success" : "error"}
        title={
          addressOneTimePaymentResult.isSuccess
            ? "Successfully sent email with secure link"
            : "Unable to create a secure link."
        }
      />
    </Stack>
  );
};

export default ViewPropertyAccordionDetails;
