import React, { lazy } from "react";

import {
  CottageRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  PropertiesRouteUri,
  PropertyRouteUri,
  RentalRouteUri,
  SettingsRouteUri,
} from "common/utils";


const Properties = lazy(
  () => import("features/Rent/components/Properties/Properties"),
);
const Property = lazy(
  () => import("features/Rent/components/Property/Property"),
);
const MyRental = lazy(
  () => import("features/Rent/components/MyRental/MyRental"),
);
const Settings = lazy(
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
    label: "Home",
    path: "",
    routeUri: "/rent",
    element: <>Overview of the Rental App</>,
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
    label: "My Properties",
    path: PropertiesRouteUri,
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
    id: 3,
    label: "My Rental Unit",
    path: RentalRouteUri,
    routeUri: "/rent/rental",
    element: <MyRental />,
    icon: <CottageRounded fontSize="small" />,
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
    id: 4,
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
    id: 5,
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

