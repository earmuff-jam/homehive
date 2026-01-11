import { lazy } from "react";

import {
  CottageRounded,
  HomeRounded,
  HomeWorkRounded,
  ReceiptRounded,
  WhatshotRounded,
} from "@mui/icons-material";
import {
  HomeRouteUri,
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  NotesRouteUri,
  RentalRouteUri,
} from "common/utils";
import { InvoiceAppRoutes } from "features/Invoice/Routes";
import SplashPage from "features/Layout/SplashPage";
import { RentalAppRoutes } from "features/Rent/Routes";
import SubAppRouter from "src/SubRouter";
import { TAppRoute } from "src/types";

const ReleaseNotes = lazy(
  () => import("features/Layout/components/ReleaseNotes"),
);

// MainAppRoutes ...
export const MainAppRoutes: TAppRoute[] = [
  {
    id: 1,
    label: "Home",
    path: HomeRouteUri,
    routeUri: HomeRouteUri,
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
      isLoggedInFeature: false,
    },
  },
  {
    id: 2,
    label: "Rent App",
    path: "/rent/*",
    routeUri: RentalRouteUri,
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
    routeUri: MainInvoiceAppRouteUri,
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
      displayHelpSelector: true,
      displayPrintSelector: true,
      isLoggedInFeature: false,
    },
  },
  {
    id: 4,
    label: "Release Notes",
    path: NotesRouteUri,
    routeUri: NotesRouteUri,
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
      isLoggedInFeature: false,
    },
  },
];
