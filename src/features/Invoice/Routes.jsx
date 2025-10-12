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
import Dashboard from "features/Invoice/components/Dashboard/Dashboard";
import EditPdf from "features/Invoice/components/PdfViewer/EditPdf";
import PdfViewer from "features/Invoice/components/PdfViewer/PdfViewer";
import RecieverInfo from "features/Invoice/components/RecieverInfo/RecieverInfo";
import SenderInfo from "features/Invoice/components/SenderInfo/SenderInfo";

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
