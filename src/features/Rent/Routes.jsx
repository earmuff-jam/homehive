import React from "react";

import {
  ApartmentRounded,
  CottageRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  PropertiesRoutePath,
  PropertiesRouteUri,
  PropertyRoutePath,
  PropertyRouteUri,
  RentalRoutePath,
  RentalRouteUri,
  SettingsRoutePath,
  SettingsRouteUri,
} from "common/utils";

const MyRental = React.lazy(
  () => import("features/Rent/components/MyRental/MyRental"),
);
const Properties = React.lazy(
  () => import("features/Rent/components/Properties/Properties"),
);
const Property = React.lazy(
  () => import("features/Rent/components/Property/Property"),
);

const Settings = React.lazy(
  () => import("features/Rent/components/Settings/Settings"),
);

/**
 * RentalAppRoutes ...
 *
 * routes that are built for rental app
 */
export const RentalAppRoutes = [
  {
    id: 1,
    label: "My Properties",
    path: PropertiesRoutePath,
    routeUri: PropertiesRouteUri,
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
    path: RentalRoutePath,
    routeUri: RentalRouteUri,
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
    path: SettingsRoutePath,
    routeUri: SettingsRouteUri,
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
    path: PropertyRoutePath,
    routeUri: PropertyRouteUri,
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
