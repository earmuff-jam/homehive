import React, { lazy } from "react";

import {
  ContactSupportRounded,
  CottageRounded,
  DashboardCustomizeRounded,
  DashboardRounded,
  EditRounded,
  HomeRounded,
  HomeWorkRounded,
  LiveHelpRounded,
  Person2Rounded,
  PictureAsPdfRounded,
  ReceiptRounded,
  SettingsRounded,
  WhatshotRounded,
} from "@mui/icons-material";
import {
  EditInvoiceRouteUri,
  FaqRouteUri,
  HomeRouteUri,
  InvoiceDashboardRouteUri,
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  NotesRouteUri,
  PropertiesRouteUri,
  PropertyRouteUri,
  RecieverInforamtionRouteUri,
  RentalRouteUri,
  SenderInforamtionRouteUri,
  SettingsRouteUri,
  ViewInvoiceRouteUri,
} from "common/utils";
import SplashPage from "features/Layout/SplashPage";
import SubAppRouter from "src/SubRouter";

const Overview = lazy(
  () => import("features/Layout/components/Landing/Overview"),
);
const Dashboard = lazy(
  () => import("features/InvoiceWorks/components/Dashboard/Dashboard"),
);
const PdfViewer = lazy(
  () => import("features/InvoiceWorks/components/PdfViewer/PdfViewer"),
);
const EditPdf = lazy(
  () => import("features/InvoiceWorks/components/PdfViewer/EditPdf"),
);
const SenderInfo = lazy(
  () => import("features/InvoiceWorks/components/SenderInfo/SenderInfo"),
);
const RecieverInfo = lazy(
  () => import("features/InvoiceWorks/components/RecieverInfo/RecieverInfo"),
);
const FaqSection = lazy(
  () => import("features/Layout/components/HelpAndSupport/FaqSection"),
);
const ReleaseNotes = lazy(
  () => import("features/Layout/components/HelpAndSupport/ReleaseNotes"),
);

const Properties = lazy(
  () => import("features/RentWorks/components/Properties/Properties"),
);
const Property = lazy(
  () => import("features/RentWorks/components/Property/Property"),
);
const MyRental = lazy(
  () => import("features/RentWorks/components/MyRental/MyRental"),
);
const Settings = lazy(
  () => import("features/RentWorks/components/Settings/Settings"),
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

/**
 * InvoiceAppRoutes ...
 *
 * routes that are built for invoice app
 */
export const InvoiceAppRoutes = [
  {
    id: 1,
    label: "Home",
    path: "/",
    routeUri: "/invoice",
    element: <Overview />,
    icon: <PictureAsPdfRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
    config: {
      breadcrumb: {
        value: "View Invoice",
        icon: <ReceiptRounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: true,
    },
  },
  {
    id: 2,
    label: "Dashboard",
    path: InvoiceDashboardRouteUri,
    routeUri: "/invoice/dashboard",
    element: <Dashboard />,
    icon: <DashboardCustomizeRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "View Dashboard",
        icon: <DashboardRounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 3,
    label: "View Invoice",
    path: ViewInvoiceRouteUri,
    routeUri: "/invoice/view",
    element: <PdfViewer />,
    icon: <PictureAsPdfRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
    config: {
      breadcrumb: {
        value: "View Invoice",
        icon: <ReceiptRounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: true,
    },
  },
  {
    id: 4,
    label: "Edit Invoice",
    path: EditInvoiceRouteUri,
    routeUri: "/invoice/edit",
    element: <EditPdf />,
    icon: <EditRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
    config: {
      breadcrumb: {
        value: "Edit Invoice",
        icon: <EditRounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 5,
    label: "Sender",
    path: SenderInforamtionRouteUri,
    routeUri: "/invoice/sender",
    element: <SenderInfo />,
    icon: <Person2Rounded fontSize="small" />,
    requiredFlags: ["userInformation"],
    config: {
      breadcrumb: {
        value: "Sender Information",
        icon: <Person2Rounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 6,
    label: "Reciever",
    path: RecieverInforamtionRouteUri,
    routeUri: "/invoice/reciever",
    element: <RecieverInfo />,
    icon: <Person2Rounded fontSize="small" />,
    requiredFlags: ["userInformation"],
    config: {
      breadcrumb: {
        value: "Reciever Information",
        icon: <Person2Rounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
];

/**
 * MainAppRoutes ...
 *
 * root routes for the app
 */
export const MainAppRoutes = [
  {
    id: 1,
    label: "Home",
    path: HomeRouteUri,
    element: <SplashPage />,
    icon: <HomeRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "",
        icon: "",
      },
      displayInNavBar: true,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 2,
    label: "Rent App",
    path: "/rent/*",
    element: (
      <SubAppRouter
        routes={RentalAppRoutes}
        fallbackPath={MainRentAppRouteUri}
      />
    ),
    icon: <HomeWorkRounded fontSize="small" />,
    requiredFlags: ["invoicerPro"],
    config: {
      breadcrumb: {
        value: "Rental App",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true,
      displayInNavBar: true,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 3,
    label: "Invoice App",
    path: "/invoice/*",
    element: (
      <SubAppRouter
        routes={InvoiceAppRoutes}
        fallbackPath={MainInvoiceAppRouteUri}
      />
    ),
    icon: <ReceiptRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
    config: {
      breadcrumb: {
        value: "Invoice App",
        icon: <ReceiptRounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 4,
    label: "FAQ",
    path: FaqRouteUri,
    element: <FaqSection />,
    icon: <LiveHelpRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
    config: {
      breadcrumb: {
        value: "Frequently Asked Questions",
        icon: <ContactSupportRounded fontSize="small" />,
      },
      displayInNavBar: false,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 5,
    label: "Release Notes",
    path: NotesRouteUri,
    element: <ReleaseNotes />,
    icon: <WhatshotRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
    config: {
      breadcrumb: {
        value: "Release Notes",
        icon: <WhatshotRounded fontSize="small" />,
      },
      displayInNavBar: false,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
];
