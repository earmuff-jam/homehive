import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  BusinessRounded,
  EmailRounded,
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
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  useCreateRentRecordMutation,
  useLazyGetRentByMonthQuery,
} from "features/Api/rentApi";
import { useGetTenantByIdQuery } from "features/Api/tenantsApi";
import { getStripeFailureReasons } from "features/Rent/components/Settings/common";
import { useCheckStripeAccountStatus } from "features/Rent/hooks/useCheckStripeAccountStatus";
import { useGenerateStripeCheckoutSession } from "features/Rent/hooks/useGenerateStripeCheckoutSession";
import { fetchLoggedInUser, formatCurrency } from "features/Rent/utils";

export default function PropertyOwnerInfoCard({
  isViewingRental = false,
  isPropertyLoading = false,
  property,
  dataTour,
}) {
  const user = fetchLoggedInUser();
  const { generateStripeCheckoutSession } = useGenerateStripeCheckoutSession();
  const { checkStatus, loading: isCheckStripeAccountStatusLoading } =
    useCheckStripeAccountStatus();

  const [createRentRecord, { isError: isCreatingRentRecordError, error }] =
    useCreateRentRecordMutation();

  const { data: owner = {}, isLoading } = useGetUserDataByIdQuery(
    property?.createdBy,
    {
      skip: !property?.createdBy,
    },
  );

  const { data: tenant = {} } = useGetTenantByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const [triggerGetRentByMonth, { data: rentMonthData = [] }] =
    useLazyGetRentByMonthQuery();

  const [stripeValid, setStripeValid] = useState(false);

  const paymentCompleteForCurrentMonth = rentMonthData?.some(
    (item) => item.status === "paid" || item.status === "manual",
  );

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
    rentMonth,
    tenantEmail,
  }) => {
    if (!stripeAccountIsActive) {
      return;
    }

    const draftData = {
      id: uuidv4(),
      rentAmount: Math.round(rentAmount * 100),
      additionalCharges: Math.round(additionalCharges * 100),
      initialLateFee: Math.round(Number(initialLateFee) || 0 * 100),
      dailyLateFee: Math.round(Number(dailyLateFee) || 0 * 100),
      stripeOwnerAccountId, // the person who the payment must go towards
      tenantEmail,
      propertyId,
      propertyOwnerId,
      tenantId,
      rentMonth,
    };

    const stripeCheckoutSessionData =
      await generateStripeCheckoutSession(draftData);

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
      const currentMonth = dayjs().format("MMMM");
      triggerGetRentByMonth({
        propertyId: property?.id,
        rentMonth: currentMonth,
      });
    }
  }, [property?.id]);

  useEffect(() => {
    const checkStripeStatus = async (accountId) => {
      try {
        const status = await checkStatus({ accountId });
        const reasons = getStripeFailureReasons(status);
        if (reasons?.length <= 0) {
          setStripeValid(true);
        }
      } catch (err) {
        setStripeValid(false);
        /* eslint-disable no-console */
        console.error(err);
      }
    };
    owner?.stripeAccountId && checkStripeStatus(owner?.stripeAccountId);
  }, [owner?.stripeAccountId, isPropertyLoading]);

  if (isLoading) return <Skeleton height="10rem" />;

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
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
          caption={<BusinessRounded color="primary" />}
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
                mb: 2,
              }}
            >
              <Avatar
                src={owner?.googlePhotoURL}
                sx={{ width: 56, height: 56 }}
              >
                {owner?.first_name?.charAt(0)}
                {owner?.last_name?.charAt(0)}
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
                        `${owner?.first_name || ""} ${owner?.last_name || ""}`}
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
                      {owner?.googleEmailAddress}
                    </Typography>
                  </Stack>
                  {isViewingRental && (
                    <Tooltip title="Send Email">
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
                      sx={{ fontSize: "0.675rem" }}
                    >
                      Rent can be paid only if the owner has stripe setup and if
                      current month is due.
                    </Typography>
                  </Alert>
                </Box>

                <AButton
                  size="small"
                  variant="contained"
                  label="Pay rent"
                  sx={{ margin: "0.4rem 0rem" }}
                  loading={isCheckStripeAccountStatusLoading}
                  disabled={!stripeValid || paymentCompleteForCurrentMonth}
                  onClick={() =>
                    handleRentPayment({
                      stripeOwnerAccountId: owner?.stripeAccountId,
                      stripeAccountIsActive: owner?.stripeAccountIsActive,
                      propertyId: property?.id,
                      propertyOwnerId: property?.createdBy, // the owner of the property
                      tenantId: user?.uid, // the current payee which is also a tenant
                      rentMonth: dayjs().format("MMMM"),
                      tenantEmail: user?.googleEmailAddress, // the current renter
                      rentAmount: formatCurrency(Number(property?.rent)),
                      additionalCharges: formatCurrency(
                        Number(property?.additional_rent),
                      ),
                      initialLateFee: formatCurrency(
                        Number(tenant?.initialLateFee),
                      ),
                      dailyLateFee: formatCurrency(
                        Number(tenant?.dailyLateFee),
                      ),
                    })
                  }
                />
              </Stack>
            ) : null}
          </>
        )}
      </CardContent>
      <CustomSnackbar
        severity="warning"
        showSnackbar={isCreatingRentRecordError}
        setShowSnackbar={() => {}}
        title={`${error?.message}`}
      />
    </Card>
  );
}
