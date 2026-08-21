import React from "react";

import { Bar } from "react-chartjs-2";

import { Stack } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";
import { normalizeInvoiceTimelineChartDataset } from "features/Invoice/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

const InvoiceTimelineChart = ({ data = {} }) => {
  const options = {
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

  const chartData = normalizeInvoiceTimelineChartDataset([data]);

  return (
    <Stack data-tour="dashboard-4">
      {Object.keys(data).length <= 0 ? (
        <EmptyComponent />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default InvoiceTimelineChart;
