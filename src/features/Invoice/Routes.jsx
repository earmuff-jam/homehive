import React from "react";

import {
  DashboardCustomizeRounded,
  DashboardRounded,
  EditRounded,
  Person2Rounded,
  PictureAsPdfRounded,
  ReceiptRounded,
} from "@mui/icons-material";
import {
  EditInvoiceRouteUri,
  RecieverInforamtionRouteUri,
  SenderInforamtionRouteUri,
  ViewInvoiceRouteUri,
} from "common/utils";

const Dashboard = React.lazy(
  () => import("features/Invoice/components/Dashboard/Dashboard"),
);
const EditPdf = React.lazy(
  () => import("features/Invoice/components/EditPdf/EditPdf"),
);
const PdfViewer = React.lazy(
  () => import("features/Invoice/components/PdfViewer/PdfViewer"),
);
const RecieverInfo = React.lazy(
  () => import("features/Invoice/components/RecieverInfo/RecieverInfo"),
);
const SenderInfo = React.lazy(
  () => import("features/Invoice/components/SenderInfo/SenderInfo"),
);

/**
 * InvoiceAppRoutes ...
 *
 * routes that are built for invoice app
 */
export const InvoiceAppRoutes = [
  {
    id: 1,
    label: "Dashboard",
    path: "",
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
