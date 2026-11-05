import React from "react";

import { Bar, Line } from "react-chartjs-2";

import { Stack } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";
import { TaxChartTypes } from "features/Invoice/constants";
import { normalizeTrendsChart } from "features/Invoice/utils/normalizeTrendsChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
);

const InvoiceTrendsChart = ({ data = [], chartType = "" }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Invoice Totals & Tax Collected Over Time",
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: chartType === "bar",
      },
      x: {
        stacked: chartType === "bar",
      },
    },
  };

  const chartData = normalizeTrendsChart(data, chartType);

  return (
    <Stack
      data-tour="dashboard-6"
      sx={{
        minHeight: 0,
        width: "100%",
        height: "calc(100% - 5rem)",
      }}
    >
      {chartData?.labels?.length <= 0 ? (
        <EmptyComponent />
      ) : chartType === TaxChartTypes.Bar ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default InvoiceTrendsChart;
