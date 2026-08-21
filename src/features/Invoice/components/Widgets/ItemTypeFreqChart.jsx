import React from "react";

import { Bar } from "react-chartjs-2";

import { Stack } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";
import { normalizeInvoiceItemTypeChartDataset } from "features/Invoice/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
);

const ItemTypeFreqChart = ({ data }) => {
  const options = {
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

  const chartData = normalizeInvoiceItemTypeChartDataset([data]);

  return (
    <Stack data-tour="dashboard-6">
      {Object.keys(chartData).length <= 0 ? (
        <EmptyComponent />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default ItemTypeFreqChart;
