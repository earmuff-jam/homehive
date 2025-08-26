import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Business, Home, LocationOn } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader/RowHeader";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import {
  useGetTenantByEmailIdQuery,
  useGetTenantByPropertyIdQuery,
} from "features/Api/tenantsApi";
import PropertyOwnerInfoCard from "features/RentWorks/common/PropertyOwnerInfoCard";
import PropertyStatistics from "features/RentWorks/common/PropertyStatistics";
import { fetchLoggedInUser } from "features/RentWorks/common/utils";
import DocumentsOverview from "features/RentWorks/components/Widgets/DocumentsOverview";
import FinancialOverview from "features/RentWorks/components/Widgets/FinancialOverview";
import RentalPaymentOverview from "features/RentWorks/components/Widgets/RentalPaymentOverview";
import { useConfirmStripePayment } from "features/RentWorks/hooks/useStripe";
import { useAppTitle } from "hooks/useAppTitle";

const MyRental = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = fetchLoggedInUser();

  const { confirmPayment } = useConfirmStripePayment();

  const { data: renter, isLoading } = useGetTenantByEmailIdQuery(
    user?.googleEmailAddress,
    {
      skip: !user?.googleEmailAddress,
    },
  );

  const { data: property, isLoading: isPropertyLoading } =
    useGetPropertiesByPropertyIdQuery(renter?.propertyId, {
      skip: !renter?.propertyId,
    });

  const { data: tenants, isLoading: isTenantsLoading } =
    useGetTenantByPropertyIdQuery(property?.id, {
      skip: !property?.id,
    });

  const { data: owner = {}, isLoading: isOwnerDataLoading } =
    useGetUserDataByIdQuery(property?.createdBy, {
      skip: !property?.createdBy,
    });

  useAppTitle(property?.name || "My Rental Unit");

  // if home is SoR, then only each bedroom is counted as a unit
  const isAnyTenantSoR = tenants?.some((tenant) => tenant.isSoR);

  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");
    if (Number(success) === 1 && sessionId && owner?.stripeAccountId) {
      confirmPayment(user?.uid, sessionId, owner?.stripeAccountId);
      navigate(location?.pathname, { replace: true });
    }
  }, [location, isOwnerDataLoading]);

  if (isLoading) return <Skeleton height="10rem" />;

  if (!property)
    return (
      <EmptyComponent caption="No properties have been assigned to you as a tenant. Contact your admin for more details." />
    );

  return (
    <Stack data-tour="rental-0">
      {/* Property Header */}
      <Paper elevation={0} sx={{ padding: 3, margin: "1rem 0rem" }}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Home color="primary" sx={{ fontSize: 40 }} />
              <Stack>
                <Typography variant="h4" gutterBottom>
                  {property?.name}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LocationOn />
                  {property?.address}, {property?.city}, {property?.state}&nbsp;
                  {property?.zipcode}
                </Typography>
              </Stack>
            </Box>
            <Box>
              {renter?.isPrimary ? (
                <Chip label="Primary Renter" />
              ) : (
                <Chip label="Secondary Renter" />
              )}
            </Box>
          </Stack>
        )}
        {/* Property Stats */}
        <PropertyStatistics
          dataTour="rental-1"
          property={property}
          isPropertyLoading={isPropertyLoading}
          isAnyTenantSoR={isAnyTenantSoR}
          tenants={tenants}
        />
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <FinancialOverview
            isTenantsLoading={isTenantsLoading}
            property={property}
            tenants={tenants}
            isAnyTenantSoR={isAnyTenantSoR}
            dataTour="rental-2"
          />
          <DocumentsOverview
            dataTour="rental-6"
            isPropertyLoading={isPropertyLoading}
            property={property}
          />
          <RentalPaymentOverview
            dataTour="rental-7"
            propertyId={property?.id}
            propertyName={property?.name || "Unknown"}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <PropertyOwnerInfoCard
            dataTour="rental-3"
            isViewingRental
            isPropertyLoading={isPropertyLoading}
            property={property}
          />

          <Card sx={{ mb: 3 }} data-tour="rental-4">
            <CardContent data-tour="rental-5">
              <RowHeader
                title="Property Details"
                sxProps={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "flex-end",
                  gap: 1,
                  textAlign: "left",
                  variant: "subtitle2",
                  fontWeight: "bold",
                }}
                caption={<Business color="primary" />}
              />
              {isPropertyLoading ? (
                <Skeleton height="10rem" />
              ) : (
                <Stack spacing={2}>
                  <Stack direction="row">
                    <Stack textAlign="center" flexGrow={1}>
                      <Typography variant="h4" color="success.main">
                        {property?.units}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Bedrooms
                      </Typography>
                    </Stack>
                    <Stack textAlign="center" flexGrow={1}>
                      <Typography variant="h4" color="success.main">
                        {property?.bathrooms}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Bathrooms
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack textAlign="center" flexGrow={1}>
                      <Tooltip
                        title={dayjs(property?.createdOn).format(
                          "MMM DD, YYYY",
                        )}
                      >
                        <Stack>
                          <Typography variant="subtitle2">
                            {dayjs(property?.createdOn).format("MM DD YYYY")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </Stack>
                    <Stack textAlign="center" flexGrow={1}>
                      <Tooltip title={dayjs(property?.updatedOn)}>
                        <Stack>
                          <Typography variant="subtitle2">
                            {dayjs(property?.updatedOn).fromNow()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last Updated
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default MyRental;
