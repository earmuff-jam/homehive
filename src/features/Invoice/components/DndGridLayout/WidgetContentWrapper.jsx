import React from "react";

import DetailsTableView from "features/Invoice/components/Widgets/DetailsTableView";
import InvoiceTimelineChart from "features/Invoice/components/Widgets/InvoiceTimelineChart";
import InvoiceTrendsChart from "features/Invoice/components/Widgets/InvoiceTrends";
import ItemTypeFreqChart from "features/Invoice/components/Widgets/ItemTypeFreqChart";
import { WidgetTypeProps } from "features/Invoice/constants";

export default function WidgetContentWrapper({ widget, data = [] }) {
  switch (widget?.type) {
    case WidgetTypeProps.TimelineChart:
      return <InvoiceTimelineChart data={data} />;
    case WidgetTypeProps.TaxChart:
      return <InvoiceTrendsChart data={data} />;
    case WidgetTypeProps.ServiceChart:
      return <ItemTypeFreqChart data={data} />;
    case WidgetTypeProps.DetailsTable:
      return <DetailsTableView data={data} />;
    default:
      return null;
  }
}
