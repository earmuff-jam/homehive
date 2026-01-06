import { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";

import { Stack } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "features/Invoice/components/RowHeader/InvoiceRowHeader";
import {
  Invoice,
  InvoiceItemTypeChartData,
} from "features/Invoice/types/Invoice.types";
import {
  normalizeInvoiceItemTypeChartDataset,
  parseJsonUtility,
} from "features/Invoice/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
);

// ItemTypeFreqChartProps ...
type ItemTypeFreqChartProps = {
  label: string;
  caption: string;
};

const ItemTypeFreqChart = ({ label, caption }: ItemTypeFreqChartProps) => {
  const [chartData, setChartData] = useState<InvoiceItemTypeChartData>(null);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Item Type Frequency",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  useEffect(() => {
    const invoice = parseJsonUtility<Invoice>(
      localStorage.getItem("pdfDetails"),
    );
    if (invoice) {
      const chartData = normalizeInvoiceItemTypeChartDataset([invoice]);
      setChartData(chartData);
    }
  }, []);

  return (
    <Stack data-tour={"dashboard-6"}>
      <RowHeader
        title={label}
        caption={caption}
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
      />
      {!chartData ? (
        <EmptyComponent />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default ItemTypeFreqChart;
