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
  Slide,
  Stack,
} from "@mui/material";
import AButton from "common/AButton";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import AssociateTenantPopup from "features/RentWorks/common/AssociateTenantPopup";
import PropertyDetails from "features/RentWorks/common/PropertyDetails";
import PropertyHeader from "features/RentWorks/common/PropertyHeader";
import PropertyOwnerInfoCard from "features/RentWorks/common/PropertyOwnerInfoCard";
import PropertyStatistics from "features/RentWorks/common/PropertyStatistics";
import DocumentsOverview from "features/RentWorks/components/Widgets/DocumentsOverview";
import FinancialOverview from "features/RentWorks/components/Widgets/FinancialOverview";
import QuickActions from "features/RentWorks/components/Widgets/QuickActions";
import RentalPaymentOverview from "features/RentWorks/components/Widgets/RentalPaymentOverview";
import TenantsOverview from "features/RentWorks/components/Widgets/TenantsOverview";
import { useAppTitle } from "hooks/useAppTitle";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Property = () => {
  const params = useParams();
  const { data: property, isLoading: isPropertyLoading } =
    useGetPropertiesByPropertyIdQuery(params?.id, {
      skip: !params?.id,
    });

  const { data: tenants = [], isLoading: isTenantsLoading } =
    useGetTenantByPropertyIdQuery(params?.id, {
      skip: !params?.id,
    });

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
          <DocumentsOverview
            isPropertyLoading={isPropertyLoading}
            property={property}
            dataTour="property-6"
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
            propertyId={property?.id}
            propertyName={property?.name || "Unknown"}
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
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Associate Tenants </DialogTitle>
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
