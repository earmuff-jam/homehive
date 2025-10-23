import React from "react";

import {
  ApartmentRounded,
  CottageRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  PropertyRouteUri,
  RentalRouteUri,
  SettingsRouteUri,
} from "common/utils";
import MyRental from "features/Rent/components/MyRental/MyRental";
import Properties from "features/Rent/components/Properties/Properties";
import Property from "features/Rent/components/Property/Property";
import Settings from "features/Rent/components/Settings/Settings";

/**
 * RentalAppRoutes ...
 *
 * routes that are built for rental app
 */
export const RentalAppRoutes = [
  {
    id: 1,
    label: "My Properties",
    path: "/properties",
    routeUri: "/rent/properties",
    element: <Properties />,
    icon: <CottageRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My properties",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 2,
    label: "My Rental Unit",
    path: RentalRouteUri,
    routeUri: "/rent/rental",
    element: <MyRental />,
    icon: <ApartmentRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My rental unit",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 3,
    label: "Settings",
    path: SettingsRouteUri,
    routeUri: "/rent/settings",
    element: <Settings />,
    icon: <SettingsRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My settings",
        icon: <SettingsRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 4,
    label: "My Property",
    path: PropertyRouteUri,
    routeUri: "/rent/property/:id",
    element: <Property />,
    icon: <CottageRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My property",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      displayInNavBar: false,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
];
