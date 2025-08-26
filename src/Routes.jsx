import { lazy } from "react";

import {
  ContactSupportRounded,
  CottageRounded,
  DashboardCustomizeRounded,
  DashboardRounded,
  EditRounded,
  HomeRounded,
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
  NotesRouteUri,
  PropertiesRouteUri,
  PropertyRouteUri,
  RecieverInforamtionRouteUri,
  RentalRouteUri,
  SenderInforamtionRouteUri,
  SettingsRouteUri,
  ViewInvoiceRouteUri,
} from "common/utils";
import {
  OwnerRole,
  TenantRole,
} from "features/Layout/components/Landing/constants";

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
 * RentWorksAppRoutes
 *
 * used to build out the route of the application. required flags are array of string that are
 * required to be met as a client permission for the route to be in operation.
 */
export const RentWorksAppRoutes = [
  {
    id: 1,
    label: "Home",
    path: HomeRouteUri,
    element: <Overview />,
    icon: <HomeRounded fontSize="small" />,
    requiredFlags: ["invoicer"],
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
    label: "Dashboard",
    path: InvoiceDashboardRouteUri,
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
    label: "My Properties",
    path: PropertiesRouteUri,
    element: <Properties />,
    icon: <CottageRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My properties",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      enabledForRoles: [OwnerRole],
      displayInNavBar: true,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 4,
    label: "My Rental Unit",
    path: RentalRouteUri,
    element: <MyRental />,
    icon: <CottageRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My rental unit",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      enabledForRoles: [TenantRole],
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
  {
    id: 5,
    label: "View Invoice",
    path: ViewInvoiceRouteUri,
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
    id: 6,
    label: "Edit Invoice",
    path: EditInvoiceRouteUri,
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
    id: 7,
    label: "Sender",
    path: SenderInforamtionRouteUri,
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
    id: 8,
    label: "Reciever",
    path: RecieverInforamtionRouteUri,
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
  {
    id: 9,
    label: "Settings",
    path: SettingsRouteUri,
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
    id: 10,
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
  {
    id: 11,
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
    id: 12,
    label: "My Properties",
    path: PropertyRouteUri,
    element: <Property />,
    icon: <CottageRounded fontSize="small" />,
    requiredFlags: ["invoicer", "invoicerPro"],
    config: {
      breadcrumb: {
        value: "My properties",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true, // only display if logged in
      enabledForRoles: [OwnerRole],
      displayInNavBar: false,
      displayHelpSelector: true,
      displayPrintSelector: false,
    },
  },
];
