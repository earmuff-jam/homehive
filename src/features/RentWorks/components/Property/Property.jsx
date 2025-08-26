import React, { useState } from "react";

import { useParams } from "react-router-dom";

import dayjs from "dayjs";

import { Business, Home, LocationOn } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Slide,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import RowHeader from "common/RowHeader/RowHeader";
import { useGetPropertiesByPropertyIdQuery } from "features/Api/propertiesApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import AssociateTenantPopup from "features/RentWorks/common/AssociateTenantPopup";
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
          {/* Financial Overview */}
          <FinancialOverview
            isTenantsLoading={isTenantsLoading}
            property={property}
            tenants={tenants}
            isAnyTenantSoR={isAnyTenantSoR}
            dataTour="property-2"
          />

          {/* Documents Overview */}
          <DocumentsOverview
            isPropertyLoading={isPropertyLoading}
            property={property}
            dataTour="property-6"
          />

          {/* Tenants Overview */}
          <TenantsOverview
            property={property}
            tenants={tenants.filter((tenant) => tenant.isActive)}
            isTenantsLoading={isTenantsLoading}
            dataTour="property-8"
            toggleAssociateTenantsPopup={toggleAssociateTenantsPopup}
          />

          {/* Rental Payment Overview */}
          <RentalPaymentOverview
            dataTour="property-7"
            propertyId={property?.id}
            propertyName={property?.name || "Unknown"}
          />

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
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <PropertyOwnerInfoCard
            dataTour="property-3"
            property={property}
            isPropertyLoading={isPropertyLoading}
          />

          {/* Property Details */}
          <Card sx={{ mb: 3 }} data-tour="property-4">
            <CardContent>
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

          {/* Quick Actions */}
          <Card data-tour="property-5">
            <CardContent>
              <RowHeader
                title="Quick Actions"
                sxProps={{
                  textAlign: "left",
                  variant: "subtitle2",
                  fontWeight: "bold",
                }}
              />
              <QuickActions property={property} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Property;
