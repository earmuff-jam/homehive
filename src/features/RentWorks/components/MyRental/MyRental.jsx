import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Alert,
  Button,
  Grid2 as Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetRentsByPropertyIdQuery } from "features/Api/rentApi";
import {
  useGetTenantByEmailIdQuery,
  useGetTenantByPropertyIdQuery,
} from "features/Api/tenantsApi";
import PropertyDetails from "features/RentWorks/common/PropertyDetails";
import PropertyHeader from "features/RentWorks/common/PropertyHeader";
import PropertyOwnerInfoCard from "features/RentWorks/common/PropertyOwnerInfoCard";
import PropertyStatistics from "features/RentWorks/common/PropertyStatistics";
import { fetchLoggedInUser } from "features/RentWorks/common/utils";
import DocumentsOverview from "features/RentWorks/components/Widgets/DocumentsOverview";
import FinancialOverview from "features/RentWorks/components/Widgets/FinancialOverview";
import RentalPaymentOverview from "features/RentWorks/components/Widgets/RentalPaymentOverview";
import { useAppTitle } from "hooks/useAppTitle";

const MyRental = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

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

  const { data: rentList = [], isLoading: isRentListForPropertyLoading } =
    useGetRentsByPropertyIdQuery(
      { propertyId: property?.id, currentUserEmail: user?.googleEmailAddress },
      {
        skip: !property?.id,
      },
    );

  useAppTitle(property?.name || "My Rental Unit");

  const [alert, setAlert] = useState(false);

  // if home is SoR, then only each bedroom is counted as a unit
  const isAnyTenantSoR = tenants?.some((tenant) => tenant.isSoR);

  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");
    if (Number(success) === 1 && sessionId && owner?.stripeAccountId) {
      navigate(location?.pathname, { replace: true });
      setAlert(true);
    }
  }, [location, isOwnerDataLoading]);

  if (isLoading) return <Skeleton height="10rem" />;

  if (!property)
    return (
      <EmptyComponent caption="No properties have been assigned to you as a tenant. Contact your admin for more details." />
    );

  return (
    <Stack data-tour="rental-0">
      {alert && (
        <Alert
          severity="info"
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          }
        >
          <Typography sx={{ textTransform: "initial" }}>
            To maintain data integrity and get latest payment details, please
            refresh your browser
          </Typography>
        </Alert>
      )}
      <Paper elevation={0} sx={{ padding: 3, margin: "1rem 0rem" }}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <PropertyHeader
            isRentee
            property={property}
            isPrimaryRenter={renter?.isPrimary}
          />
        )}
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
            rentList={rentList}
            isRentListForPropertyLoading={isRentListForPropertyLoading}
            propertyName={property?.name || "Unknown"}
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <PropertyOwnerInfoCard
            dataTour="rental-3"
            isViewingRental
            isPropertyLoading={isPropertyLoading}
            property={property}
          />
          <PropertyDetails
            dataTour="rental-4"
            property={property}
            isPropertyLoading={isPropertyLoading}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default MyRental;
