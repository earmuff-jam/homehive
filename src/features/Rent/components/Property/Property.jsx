import React, { useState } from "react";

import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import AButton from "common/AButton";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetRentsByPropertyIdQuery } from "features/Api/rentApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import PropertyDetails from "features/Rent/common/PropertyDetails";
import PropertyHeader from "features/Rent/common/PropertyHeader";
import PropertyOwnerInfoCard from "features/Rent/common/PropertyOwnerInfoCard";
import PropertyStatistics from "features/Rent/common/PropertyStatistics";
import AssociateTenantPopup from "features/Rent/components/AssociateTenantPopup/AssociateTenantPopup";
import DocumentsOverview from "features/Rent/components/Widgets/DocumentsOverview";
import FinancialOverview from "features/Rent/components/Widgets/FinancialOverview";
import QuickActions from "features/Rent/components/Widgets/QuickActions";
import RentalPaymentOverview from "features/Rent/components/Widgets/RentalPaymentOverview";
import TenantsOverview from "features/Rent/components/Widgets/TenantsOverview";
import { fetchLoggedInUser } from "features/Rent/utils";
import { useAppTitle } from "hooks/useAppTitle";

const Property = () => {
  const params = useParams();
  const user = fetchLoggedInUser();

  const { data: property, isLoading: isPropertyLoading } =
    useGetPropertiesByPropertyIdQuery(params?.id, {
      skip: !params?.id,
    });

  const { data: tenants = [], isLoading: isTenantsLoading } =
    useGetTenantByPropertyIdQuery(params?.id, {
      skip: !params?.id,
    });

  const { data: rentList = [], isLoading: isRentListForPropertyLoading } =
    useGetRentsByPropertyIdQuery(
      { propertyId: params?.id, currentUserEmail: user?.email },
      {
        skip: !params?.id,
      },
    );

  const { data: userData, isLoading: isUserDataFromDbLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    });

  const isEsignConnected = userData?.esignAccountIsActive;

  useAppTitle(property?.name || "Selected Property");

  const [dialog, setDialog] = useState(false);

  const toggleAssociateTenantsPopup = () => setDialog(!dialog);

  // if home is SoR, then only each bedroom is counted as a unit
  const isAnyTenantSoR = tenants?.some((tenant) => tenant.isSoR);

  return (
    <Stack data-tour="property-0">
      {/* Property Header */}
      <Paper elevation={0} sx={{ padding: 3, margin: "1rem 0rem" }}>
        {isPropertyLoading ? (
          <Skeleton height="5rem" />
        ) : (
          <PropertyHeader property={property} />
        )}
        <PropertyStatistics
          dataTour="property-1"
          property={property}
          isPropertyLoading={isPropertyLoading}
          isAnyTenantSoR={isAnyTenantSoR}
          tenants={tenants}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <FinancialOverview
            isTenantsLoading={isTenantsLoading}
            property={property}
            tenants={tenants}
            isAnyTenantSoR={isAnyTenantSoR}
            dataTour="property-2"
          />
          <TenantsOverview
            property={property}
            tenants={tenants.filter((tenant) => tenant.isActive)}
            isTenantsLoading={isTenantsLoading}
            dataTour="property-8"
            toggleAssociateTenantsPopup={toggleAssociateTenantsPopup}
          />
          <RentalPaymentOverview
            dataTour="property-7"
            rentList={rentList}
            isRentListForPropertyLoading={isRentListForPropertyLoading}
            propertyName={property?.name || "Unknown"}
          />
          <DocumentsOverview
            property={property}
            dataTour="property-6"
            primaryTenant={tenants.find((tenant) => tenant.isPrimary) || {}}
            isEsignConnected={isEsignConnected}
            isPropertyLoading={isPropertyLoading || isUserDataFromDbLoading}
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <PropertyOwnerInfoCard
            dataTour="property-3"
            property={property}
            isPropertyLoading={isPropertyLoading}
          />
          <PropertyDetails
            property={property}
            isPropertyLoading={isPropertyLoading}
            dataTour="property-4"
          />
          <QuickActions property={property} />
        </Grid>
      </Grid>

      <Dialog
        open={dialog}
        keepMounted
        fullWidth
        maxWidth="lg"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Associate Tenants</DialogTitle>
        <DialogContent>
          <AssociateTenantPopup
            closeDialog={toggleAssociateTenantsPopup}
            property={property}
            tenants={tenants}
          />
        </DialogContent>
        <DialogActions>
          <AButton
            size="small"
            variant="outlined"
            onClick={toggleAssociateTenantsPopup}
            label="Close"
          />
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Property;
