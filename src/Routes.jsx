import React, { lazy } from "react";

import {
  ArchitectureRounded,
  CottageRounded,
  HomeRounded,
  HomeWorkRounded,
  ReceiptRounded,
  WhatshotRounded,
} from "@mui/icons-material";
import {
  HomeRouteUri,
  MainEsignAppRouteUri,
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  NotesRouteUri,
} from "common/utils";
import { EsignAppRoutes } from "features/Esign/Routes";
import { InvoiceAppRoutes } from "features/Invoice/Routes";
import SplashPage from "features/Layout/SplashPage";
import { RentalAppRoutes } from "features/Rent/Routes";
import SubAppRouter from "src/SubRouter";

const ReleaseNotes = lazy(
  () => import("features/Layout/components/HelpAndSupport/ReleaseNotes"),
);
const Contact = lazy(() => import("features/Layout/components/Footer/Contact"));
const HelpCenter = lazy(
  () => import("features/Layout/components/Footer/HelpCenter"),
);
const PrivacyPolicy = lazy(
  () => import("features/Layout/components/Footer/PrivacyPolicy"),
);
const TermsOfService = lazy(
  () => import("features/Layout/components/Footer/TermsOfService"),
);

// MainAppRoutes ...
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
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Rent App",
        icon: <CottageRounded fontSize="small" />,
      },
      isLoggedInFeature: true,
      displayInNavBar: true,
      displayHelpSelector: true,
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
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Invoice App",
        icon: <ReceiptRounded fontSize="small" />,
      },
      displayInNavBar: true,
      displayHelpSelector: true,
      displayPrintSelector: true,
    },
  },
  {
    id: 4,
    label: "Esign App",
    path: "/esign/*",
    element: (
      <SubAppRouter
        routes={EsignAppRoutes}
        fallbackPath={MainEsignAppRouteUri}
      />
    ),
    icon: <ArchitectureRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Esign App",
        icon: <ArchitectureRounded fontSize="small" />,
      },
      displayInNavBar: true,
      isLoggedInFeature: true,
      displayHelpSelector: true,
      displayPrintSelector: true,
    },
  },
  {
    id: 5,
    label: "Release Notes",
    path: NotesRouteUri,
    element: <ReleaseNotes />,
    icon: <WhatshotRounded fontSize="small" />,
    requiredFlags: [],
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
    id: 6,
    label: "Privacy Policy",
    path: "/privacyPolicy",
    element: <PrivacyPolicy />,
    icon: <WhatshotRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Privacy Policy",
        icon: <WhatshotRounded fontSize="small" />,
      },
      displayInNavBar: false,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 7,
    label: "Terms of Service",
    path: "/termsOfService",
    element: <TermsOfService />,
    icon: <WhatshotRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Terms of Service",
        icon: <WhatshotRounded fontSize="small" />,
      },
      displayInNavBar: false,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 8,
    label: "Contact Us",
    path: "/contact",
    element: <Contact />,
    icon: <WhatshotRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Contact Us",
        icon: <WhatshotRounded fontSize="small" />,
      },
      displayInNavBar: false,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
  {
    id: 9,
    label: "Help Center",
    path: "/helpCenter",
    element: <HelpCenter />,
    icon: <WhatshotRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Help Center",
        icon: <WhatshotRounded fontSize="small" />,
      },
      displayInNavBar: false,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
];
