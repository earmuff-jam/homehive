import React, { lazy } from "react";

import {
  ContactSupportRounded,
  CottageRounded,
  HomeRounded,
  HomeWorkRounded,
  LiveHelpRounded,
  ReceiptRounded,
  WhatshotRounded,
} from "@mui/icons-material";
import {
  FaqRouteUri,
  HomeRouteUri,
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  NotesRouteUri,
} from "common/utils";
import { InvoiceAppRoutes } from "features/Invoice/Routes";
import SplashPage from "features/Layout/SplashPage";
import { RentalAppRoutes } from "features/Rent/Routes";
import SubAppRouter from "src/SubRouter";

const FaqSection = lazy(
  () => import("features/Layout/components/HelpAndSupport/FaqSection"),
);
const ReleaseNotes = lazy(
  () => import("features/Layout/components/HelpAndSupport/ReleaseNotes"),
);

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
