import React from "react";

import ItemTypeFreqChart from "features/Invoice/components/InvoiceFreqChart/ItemTypeFreqChart";
import DetailsTableView from "features/Invoice/components/InvoiceTableView/DetailsTableView";
import InvoiceTimelineChart from "features/Invoice/components/InvoiceTimelineChart/InvoiceTimelineChart";
import InvoiceTrendsChart from "features/Invoice/components/InvoiceTrendsChart/InvoiceTrends";
import { WidgetTypeProps } from "features/Invoice/constants";

export default function WidgetContentWrapper({
  widget,
  data = [],
  chartType = "",
}) {
  switch (widget?.type) {
    case WidgetTypeProps.TimelineChart:
      return <InvoiceTimelineChart data={data} />;
    case WidgetTypeProps.TaxChart:
      return <InvoiceTrendsChart data={data} chartType={chartType} />;
    case WidgetTypeProps.ServiceChart:
      return <ItemTypeFreqChart data={data} />;
    case WidgetTypeProps.DetailsTable:
      return <DetailsTableView data={data} />;
    default:
      return null;
  }
}
