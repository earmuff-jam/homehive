import { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";

import { Stack } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "features/Invoice/components/RowHeader/InvoiceRowHeader";
import { TrendsChartDataset } from "features/Invoice/types/Invoice.types";
import { normalizeInvoiceTimelineChartDataset } from "features/Invoice/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

// InvoiceTimelineChartProps ...
type InvoiceTimelineChartProps = {
  label: string;
  caption: string;
};

const InvoiceTimelineChart = ({
  label,
  caption,
}: InvoiceTimelineChartProps) => {
  const [data, setData] = useState<TrendsChartDataset>(null);

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Invoice Timeline",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Duration: ${context.raw} days`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
        min: 0,
        max: 31,
      },
    },
  };

  useEffect(() => {
    const draftData = JSON.parse(localStorage.getItem("pdfDetails"));
    if (draftData) {
      const chartData = normalizeInvoiceTimelineChartDataset([draftData]);
      setData(chartData);
    }
  }, []);

  return (
    <Stack data-tour={"dashboard-4"}>
      <RowHeader
        title={label}
        caption={caption}
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
      />
      {!data ? <EmptyComponent /> : <Bar data={data} options={options} />}
    </Stack>
  );
};

export default InvoiceTimelineChart;
