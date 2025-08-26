import { useEffect } from "react";

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
import RowHeader from "common/RowHeader/RowHeader";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useLazyGetRentByMonthQuery } from "features/Api/rentApi";
import { useGetTenantByIdQuery } from "features/Api/tenantsApi";
import {
  fetchLoggedInUser,
  formatCurrency,
} from "features/RentWorks/common/utils";
import { useGenerateStripeCheckoutSession } from "features/RentWorks/hooks/useGenerateStripeCheckoutSession";

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

  const { data: tenant = {} } = useGetTenantByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const [triggerGetRentByMonth, { data: rentMonthData = [] }] =
    useLazyGetRentByMonthQuery();

  const { generateStripeCheckoutSession } = useGenerateStripeCheckoutSession();

  const isStripeConnectedAndValid =
    isViewingRental && owner?.stripeAccountIsActive;

  const paymentCompleteForCurrentMonth =
    rentMonthData?.find((item) => item)?.status === "paid";

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

    const secureURL = await generateStripeCheckoutSession({
      rentAmount,
      additionalCharges,
      initialLateFee,
      dailyLateFee,
      stripeOwnerAccountId, // the person who the payment must go towards
      tenantEmail: tenantEmail,
      propertyId: propertyId,
      propertyOwnerId: propertyOwnerId,
      tenantId: tenantId,
      rentMonth: rentMonth,
    });

    window.open(secureURL, "_blank", "noopener,noreferrer");
    return;
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
                        textTransform: "initial",
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
                        textTransform: "initial",
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
                      sx={{ fontSize: "0.675rem", textTransform: "initial" }}
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
                  disabled={
                    !isStripeConnectedAndValid || paymentCompleteForCurrentMonth
                  }
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
    </Card>
  );
}
