import React from "react";

import { ArticleRounded, QuestionAnswerRounded } from "@mui/icons-material";
import {
  EsignAppFaqRouteUri,
  FaqRoutePath,
  ViewEsignRoutePath,
  ViewEsignRouteUri,
} from "common/utils";

const PdfEditor = React.lazy(
  () => import("features/Esign/components/Esign/PdfEditor"),
);
const Faq = React.lazy(() => import("features/Esign/components/Faq/Faq"));

// EsignAppRoutes ...
export const EsignAppRoutes = [
  {
    id: 1,
    label: "Esign",
    path: ViewEsignRoutePath,
    routeUri: ViewEsignRouteUri,
    element: <PdfEditor />,
    icon: <ArticleRounded fontSize="small" />,
    requiredFlags: ["esign"],
    config: {
      breadcrumb: {
        value: "Esign",
        icon: <ArticleRounded fontSize="small" />,
      },
      displayInNavBar: true,
      isLoggedInFeature: true,
      displayHelpSelector: true,
      displayPrintSelector: false,
      isProtectedBySubscriptionGuard: false,
    },
  },
  {
    id: 6,
    label: "Help Center",
    path: FaqRoutePath,
    routeUri: EsignAppFaqRouteUri,
    element: <Faq />,
    icon: <QuestionAnswerRounded fontSize="small" />,
    requiredFlags: ["esign"],
    config: {
      breadcrumb: {
        value: "Esign App Help Center",
        icon: <QuestionAnswerRounded fontSize="small" />,
      },
      displayInNavBar: true,
      isLoggedInFeature: true,
      displayHelpSelector: false,
      displayPrintSelector: false,
      isProtectedBySubscriptionGuard: false,
    },
  },
];
