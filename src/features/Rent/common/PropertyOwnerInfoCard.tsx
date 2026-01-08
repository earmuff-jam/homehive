import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { fetchUsernameFromParams } from "../utils";
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
import { fetchLoggedInUser } from "common/utils";
import {
  useCheckStripeAccountStatusMutation,
  useGenerateStripeCheckoutSessionMutation,
} from "features/Api/externalIntegrationsApi";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  useCreateRentRecordMutation,
  useLazyGetRentByMonthQuery,
} from "features/Api/rentApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import { TStripeRentPaymentSubmissionRequest } from "features/Api/types";
import {
  TCompletePaymentStatusEnum,
  TManualPaymentStatusEnum,
  TProperty,
  TRentRecordPayload,
  TStripePaymentIntentStatusEnum,
  TStripePaymentStatusEnum,
  TTenant,
} from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import { getStripeFailureReasons } from "features/Rent/components/Settings/common";
import { TUser, TUserDetails } from "src/types";

// TPropertyOwnerInfoCardProps ...
type TPropertyOwnerInfoCardProps = {
  isViewingRental?: boolean;
  isPropertyLoading?: boolean;
  isPropertySuccess?: boolean;
  property: TProperty;
  dataTour: string;
};

// StripePaymentIntentStatus ...
const StripePaymentIntentStatus: TStripePaymentIntentStatusEnum = "intent";
// StripePaymentInitializedStatus ...
const StripePaymentInitializedStatus: TStripePaymentStatusEnum = "paid";
// StripeManualEntryStatus ...
const StripeManualEntryStatus: TManualPaymentStatusEnum = "manual";

export default function PropertyOwnerInfoCard({
  isViewingRental = false,
  isPropertyLoading = false,
  isPropertySuccess = false,
  property,
  dataTour,
}: TPropertyOwnerInfoCardProps) {
  const user: TUser = fetchLoggedInUser();

  const { data: owner, isLoading } = useGetUserDataByIdQuery(
    property?.createdBy,
    {
      skip: !property?.createdBy,
    },
  ) as { data: TUserDetails; isLoading: boolean };

  const { data: tenants = [] } = useGetTenantByPropertyIdQuery(property?.id, {
    skip: !property?.id,
  }) as { data?: TTenant[] };

  const [
    checkStripeAccountStatus,
    {
      isLoading: isCheckStripeAccountStatusLoading,
      isError: isCheckStripeAccountStatusError,
      error: stripeAccountStatusError,
    },
  ] = useCheckStripeAccountStatusMutation();

  const [
    generateStripeCheckoutSession,
    { isLoading: isGenerateStripeCheckoutSessionLoading },
  ] = useGenerateStripeCheckoutSessionMutation();

  const [createRentRecord, rentRecordResult] = useCreateRentRecordMutation();

  const [triggerGetRentByMonth, rentByMonthResult] =
    useLazyGetRentByMonthQuery();

  const [stripeValid, setStripeValid] = useState<boolean>(false);

  const tenant = tenants.find((tenant) => tenant);
  const rentRecordRes = rentRecordResult.data ?? {};
  const currentMonthRentInArr: TRentRecordPayload[] =
    rentByMonthResult.data ?? [];

  const paymentCompleted = currentMonthRentInArr?.some(
    (currentMonthRent) =>
      currentMonthRent.status === StripePaymentInitializedStatus ||
      currentMonthRent.status === StripeManualEntryStatus,
  );

  const handleRentPaymentSubmission = async () => {
    const upcommingDueDate = dayjs().date(tenant.startDate.date());
    const diffDays = upcommingDueDate.diff(dayjs(), "day");
    const rentPaymentSubmission: TStripeRentPaymentSubmissionRequest = {
      id: uuidv4(),
      stripeOwnerAccountId: owner?.stripeAccountId,
      stripeAccountIsActive: Boolean(owner?.stripeAccountId),
      propertyId: property?.id,
      propertyOwnerId: property?.createdBy,
      tenantId: user.uid,
      tenantRentDueDate: tenant.startDate,
      tenantEmail: user.email,
      rent: Math.round(property.rent * 100),
      status: StripePaymentIntentStatus,
      additionalCharges: Math.round(property.additionalRent * 100),
      initialLateFee: Math.round(tenant.initialLateFee * 100),
      dailyLateFee: Math.round(tenant.dailyLateFee * 100) * Math.abs(diffDays),
      rentMonth: dayjs().format("MMMM"),
      createdBy: user.uid,
      createdOn: dayjs(),
      updatedBy: user.uid,
      updatedOn: dayjs(),
    };

    const stripeCheckoutSessionData = await generateStripeCheckoutSession(
      rentPaymentSubmission,
    );
    createRentRecord(rentPaymentSubmission);

    window.location.href = stripeCheckoutSessionData?.url;
    return null;
  };

  useEffect(() => {
    if (!rentRecordResult.isLoading && rentRecordResult.isSuccess) {
      // set custom snackbar
    }
  }, [rentRecordResult.isLoading]);

  useEffect(() => {
    if (isPropertySuccess && owner?.stripeAccountId) {
      checkStripeAccountStatus({ accountId: owner?.stripeAccountId });
      triggerGetRentByMonth({
        propertyId: property.id,
        rentMonth: dayjs().format("MMMM"),
      });
    }
  }, [owner?.stripeAccountId, isPropertyLoading]);

  useEffect(() => {
    if (!isCheckStripeAccountStatusLoading && stripeAccountStatusError) {
      if ("status" in stripeAccountStatusError) {
        const stripeAccountFailureReasons = getStripeFailureReasons(
          stripeAccountStatusError.status,
        );

        if (stripeAccountFailureReasons?.length <= 0) {
          setStripeValid(true);
          return;
        }
      }
    }
    setStripeValid(false);
  }, [isCheckStripeAccountStatusError]);

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
                      {fetchUsernameFromParams(
                        owner.googleDisplayName,
                        owner?.firstName,
                        owner?.lastName,
                      )}
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
                    {owner.city}, {owner.state} {owner.zipCode}
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
                  disabled={!stripeValid || paymentCompleted}
                  onClick={handleRentPaymentSubmission}
                />
              </Stack>
            ) : null}
          </>
        )}
      </CardContent>
      <CustomSnackbar
        severity="warning"
        showSnackbar={rentRecordResult.isError}
        setShowSnackbar={() => {}}
        title={`${rentRecordResult.error?.message}`}
      />
    </Card>
  );
}
