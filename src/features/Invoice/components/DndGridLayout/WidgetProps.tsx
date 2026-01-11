import { Box } from "@mui/material";
import DetailsTableView from "features/Invoice/components/Widgets/DetailsTableView";
import InvoiceTimelineChart from "features/Invoice/components/Widgets/InvoiceTimelineChart";
import InvoiceTrendsChart from "features/Invoice/components/Widgets/InvoiceTrends";
import ItemTypeFreqChart from "features/Invoice/components/Widgets/ItemTypeFreqChart";
import { TWidget } from "features/Invoice/types/Invoice.types";

export default function WidgetProps(widget: TWidget) {
  switch (widget.id) {
    case 1:
      return (
        <Box sx={{ height: "20rem", width: "40rem" }}>
          <InvoiceTimelineChart label={widget.label} caption={widget.caption} />
        </Box>
      );
    case 2:
      return (
        <Box sx={{ height: "20rem", width: "40rem" }}>
          <InvoiceTrendsChart label={widget.label} caption={widget.caption} />
        </Box>
      );
    case 3:
      return (
        <Box sx={{ height: "20rem", width: "40rem" }}>
          <ItemTypeFreqChart label={widget.label} caption={widget.caption} />
        </Box>
      );
    case 4:
      return <DetailsTableView label={widget.label} caption={widget.caption} />;
    default:
      return null;
  }
}
