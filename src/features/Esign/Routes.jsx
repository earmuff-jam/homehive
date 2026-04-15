import React from "react";

import { ArticleRounded } from "@mui/icons-material";
import { ViewEsignRoutePath, ViewEsignRouteUri } from "common/utils";

const PdfEditor = React.lazy(
  () => import("features/Esign/components/Esign/PdfEditor"),
);

// EsignAppRoutes ...
export const EsignAppRoutes = [
  {
    id: 1,
    label: "Esign",
    path: ViewEsignRoutePath,
    routeUri: ViewEsignRouteUri,
    element: <PdfEditor />,
    icon: <ArticleRounded fontSize="small" />,
    requiredFlags: [],
    config: {
      breadcrumb: {
        value: "Esign",
        icon: <ArticleRounded fontSize="small" />,
      },
      isLoggedInFeature: true,
      displayInNavBar: true,
      displayHelpSelector: false,
      displayPrintSelector: false,
    },
  },
];
