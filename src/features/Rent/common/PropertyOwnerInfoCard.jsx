import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  BusinessRounded,
  EmailRounded,
  HighlightOff,
  LocationOnRounded,
  PhoneRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import ConfirmationBox, {
  DefaultConfirmationBoxProps,
} from "common/ConfirmationBox";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useCheckStripeAccountStatusQuery } from "features/Api/externalIntegrationsApi";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useLazyGetMaintenanceRecordsQuery } from "features/Api/maintenanceApi";
import {
  useCreateRentRecordMutation,
  useLazyGetRentByMonthQuery,
} from "features/Api/rentApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import AddMaintenanceDetails from "features/Rent/components/Maintenance/AddMaintenanceDetails";
import { getStripeFailureReasons } from "features/Rent/components/Settings/common";
import { AddMaintenanceRecordTextString } from "features/Rent/constants";
import { useCalculateMaintenanceDetails } from "features/Rent/hooks/useCalculateMaintenanceDetails";
import { useGenerateStripeCheckoutSession } from "features/Rent/hooks/useGenerateStripeCheckoutSession";
import {
  CompleteRentStatusEnumValue,
  ManualRentStatusEnumValue,
  PaidRentStatusEnumValue,
  formatCurrency,
  getNumberOfDaysPastDue,
} from "features/Rent/utils";

// DefaultDialogProps ...
// defines the default props for dialog component
const DefaultDialogProps = {
  title: "",
  type: "",
  display: false,
};

export default function PropertyOwnerInfoCard({
  isViewingRental = false,
  isPropertyLoading = false,
  property,
  dataTour,
}) {
  const user = fetchLoggedInUser();

  const { data: owner = {}, isLoading } = useGetUserDataByIdQuery(
    property?.createdBy,
    {
      skip: !property?.createdBy,
    },
  );

  const { data = [] } = useGetTenantByPropertyIdQuery(property?.id, {
    skip: !property?.id,
  });

  const [getRentByMonth, getRentByMonthResult] = useLazyGetRentByMonthQuery();

  const [
    getMaintenanceRecord,
    { data: maintenanceRecordData, isFetching: isMaintenanceRecordsFetching },
  ] = useLazyGetMaintenanceRecordsQuery();

  const { generateStripeCheckoutSession } = useGenerateStripeCheckoutSession();
  const { isRecentRecord } = useCalculateMaintenanceDetails(
    maintenanceRecordData,
    isMaintenanceRecordsFetching,
  );

  const {
    data: stripeStatus,
    isLoading: isStripeStatusLoading,
    isError: isStripeStatusError,
    isSuccess: isStripeStatusSuccess,
  } = useCheckStripeAccountStatusQuery(owner?.stripeAccountId, {
    skip: !owner?.stripeAccountId,
  });

  const [createRentRecord, createRentRecordResult] =
    useCreateRentRecordMutation();

  const [stripeValid, setStripeValid] = useState(false);
  const [dialog, setDialog] = useState(DefaultDialogProps);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [showConfirmationBox, setShowConfirmationBox] = useState(
    DefaultConfirmationBoxProps,
  );

  const tenant = data.find((item) => item);
  const currentMonthRentData = getRentByMonthResult?.data;

  // used to confirm if payee understands that bank transactions sometimes takes > 3 days to complete.
  const hasRecentPaymentAttemptBeenMade = currentMonthRentData?.length > 0;
  const paymentCompleteForCurrentMonth = Boolean(
    currentMonthRentData?.some(
      (item) =>
        item.status === CompleteRentStatusEnumValue ||
        item.status === PaidRentStatusEnumValue ||
        item.status === ManualRentStatusEnumValue,
    ),
  );

  const closeDialog = () => {
    setDialog(DefaultDialogProps);
  };

  const handleRentPayment = async ({
    rentAmount,
    additionalCharges,
    initialLateFee,
    dailyLateFee,
    stripeOwnerAccountId,
    stripeAccountIsActive,
    propertyId,
    propertyOwnerId,
    tenantId,
    tenantEmail,
  }) => {
    if (!stripeAccountIsActive) {
      return;
    }

    const draftData = {
      id: uuidv4(),
      rentAmount,
      additionalCharges,
      initialLateFee,
      dailyLateFee,
      stripeOwnerAccountId, // the person who the payment must go towards
      tenantEmail,
      propertyId,
      propertyOwnerId,
      tenantId,
      rentMonth: dayjs().format("MMMM"),
    };

    const draftDataWithCentsDirectives = {
      ...draftData,
      rentAmount: Math.round(rentAmount * 100),
      additionalCharges: Math.round(additionalCharges * 100),
      initialLateFee: Math.round(Number(initialLateFee) * 100),
      dailyLateFee: Math.round(Number(dailyLateFee) * 100),
    };

    const stripeCheckoutSessionData = await generateStripeCheckoutSession(
      draftDataWithCentsDirectives,
    );

    await createRentRecord({
      ...draftData,
      status: "intent", // the first step of stripe checkout
      createdBy: tenantId, // tenant is the only one who can pay
      createdOn: dayjs().toISOString(),
      updatedBy: tenantId,
      updatedOn: dayjs().toISOString(),
    }).unwrap();

    window.location.href = stripeCheckoutSessionData?.url;
    return null;
  };

  useEffect(() => {
    if (property?.id) {
      getRentByMonth({
        propertyId: property?.id,
        rentMonth: dayjs().format("MMMM"),
      });

      getMaintenanceRecord({ propertyId: property?.id });
    }
  }, [property?.id]);

  useEffect(() => {
    if (isStripeStatusSuccess) {
      const reasons = getStripeFailureReasons(stripeStatus?.status);

      if (!reasons || reasons.length === 0) {
        setStripeValid(true);
      } else {
        setStripeValid(false);
      }
    }

    if (isStripeStatusError) {
      setStripeValid(false);
    }
  }, [isStripeStatusSuccess, isStripeStatusError]);

  if (isLoading) return <Skeleton height="10rem" />;

  return (
    <Card sx={{ marginBottom: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Property Owner"
          sxProps={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "flex-end",
            gap: 1,
            textAlign: "left",
            variant: "subtitle2",
            fontWeight: "bold",
          }}
          caption={<BusinessRounded color="primary" fontSize="small" />}
        />
        {isPropertyLoading ? (
          <Skeleton height="10rem" />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: 2,
              }}
            >
              <Avatar
                src={owner?.googlePhotoURL}
                sx={{ width: 56, height: 56 }}
              >
                {owner?.firstName?.charAt(0)}
                {owner?.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Stack direction="row" spacing={1}>
                  <Stack>
                    <Typography
                      flexGrow={1}
                      variant="caption"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        alignContent: "center",
                        textOverflow: "ellipsis",
                        maxWidth: 150,
                      }}
                    >
                      {owner?.googleDisplayName ||
                        `${owner?.firstName || ""} ${owner?.lastName || ""}`}
                    </Typography>
                    <Typography
                      flexGrow={1}
                      variant="caption"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        alignContent: "center",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      }}
                    >
                      {owner?.email}
                    </Typography>
                  </Stack>
                  {isViewingRental && (
                    <Tooltip title="Send email">
                      <IconButton
                        sx={{ scale: 0.875 }}
                        href={`mailto:${owner?.email}`}
                        target="_blank"
                      >
                        <EmailRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Box>
            </Box>

            <Stack spacing={1}>
              {owner?.phone && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneRounded fontSize="small" color="action" />
                  <Typography variant="body2">{owner?.phone}</Typography>
                </Box>
              )}
              {owner?.city && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnRounded fontSize="small" color="action" />
                  <Typography variant="body2">
                    {owner?.city}, {owner?.state} {owner?.zipcode}
                  </Typography>
                </Box>
              )}
            </Stack>

            {isViewingRental ? (
              <Stack spacing={1}>
                <Box>
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
                      Rent can be paid only if the owner has stripe setup and if
                      current month is due.
                    </Typography>
                  </Alert>
                </Box>
                <Box>
                  <Alert
                    variant="standard"
                    color="error"
                    icon={<WarningAmberRounded fontSize="small" />}
                  >
                    <Typography
                      color="textSecondary"
                      fontStyle="italic"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      Card payments are processed instantly and includes higher
                      processing fees. Bank transfers typically take upto 3
                      business days to complete but have lower fees.
                      <Box
                        component="a"
                        href="https://stripe.com/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          ml: 0.5,
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                      >
                        Learn more
                      </Box>
                    </Typography>
                  </Alert>
                </Box>

                <AButton
                  variant="outlined"
                  fullWidth
                  label="Create maintenance issue"
                  onClick={() =>
                    setDialog({
                      title: "Create maintenance issue",
                      type: AddMaintenanceRecordTextString,
                      display: true,
                    })
                  }
                />

                <AButton
                  size="small"
                  variant="contained"
                  label="Pay Rent"
                  sx={{ margin: "0.4rem 0rem" }}
                  loading={isStripeStatusLoading}
                  disabled={!stripeValid || paymentCompleteForCurrentMonth}
                  onClick={() =>
                    setShowConfirmationBox({
                      value: true,
                      updateKey: "rentPayment",
                      details: {
                        stripeOwnerAccountId: owner?.stripeAccountId,
                        stripeAccountIsActive: owner?.stripeAccountIsActive,
                        propertyId: property?.id,
                        propertyOwnerId: property?.createdBy, // the owner of the property
                        tenantId: user?.uid, // the current payee which is also a tenant
                        tenantEmail: user?.email, // the current renter
                        rentAmount: formatCurrency(Number(property?.rent)),
                        additionalCharges: formatCurrency(
                          Number(property?.additionalRent),
                        ),
                        initialLateFee: formatCurrency(
                          Number(tenant?.initialLateFee),
                        ),
                        dailyLateFee: formatCurrency(
                          Number(tenant?.dailyLateFee) *
                            getNumberOfDaysPastDue(
                              tenant?.startDate,
                              tenant?.gracePeriod,
                            ).count,
                        ),
                      },
                    })
                  }
                />
              </Stack>
            ) : null}
          </>
        )}
      </CardContent>

      <Dialog
        open={dialog.display}
        keepMounted
        fullWidth
        maxWidth="lg"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {dialog.type === AddMaintenanceRecordTextString && (
            <Stack spacing={1}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <RowHeader
                  title="Add maintenance request"
                  caption={`Add maintenance request for ${property?.name}`}
                  sxProps={{
                    textAlign: "left",
                  }}
                />
                <AIconButton
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={closeDialog}
                  label={<HighlightOff />}
                />
              </Stack>
              {isRecentRecord ? (
                <Alert variant="filled" severity="error">
                  A maintenance request was recently submitted. Are you sure you
                  want to proceed?
                </Alert>
              ) : null}
            </Stack>
          )}
        </DialogTitle>
        <DialogContent>
          {dialog.type === AddMaintenanceRecordTextString && (
            <AddMaintenanceDetails
              property={property}
              closeDialog={closeDialog}
              setShowSnackbar={setShowSnackbar}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationBox
        isOpen={showConfirmationBox.value}
        title="Confirm rent payment"
        captionText={
          hasRecentPaymentAttemptBeenMade
            ? "A recent attempt at rent payment was detected. Some bank accounts may take couple of days for processing. Are you sure you want to proceed?"
            : "Confirm rent payment for the current month?"
        }
        handleConfirm={() => handleRentPayment(showConfirmationBox?.details)}
        handleCancel={() => setShowConfirmationBox(DefaultConfirmationBoxProps)}
      />

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />

      <CustomSnackbar
        severity="warning"
        showSnackbar={createRentRecordResult.isError}
        setShowSnackbar={() => {}}
        title={`${createRentRecordResult.error?.message}`}
      />
    </Card>
  );
}
