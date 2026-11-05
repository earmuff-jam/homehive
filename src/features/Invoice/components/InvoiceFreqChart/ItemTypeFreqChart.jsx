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
import { normalizeItemTypeChart } from "features/Invoice/utils/normalizeItemTypeChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
);
const ItemTypeFreqChart = ({ data = [] }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
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

  const chartData = normalizeItemTypeChart(data);
  const containsLabels = chartData?.labels.length;

  return (
    <Stack
      data-tour="dashboard-7"
      sx={{
        minHeight: 0,
        width: "100%",
        height: "calc(100% - 3rem)",
      }}
    >
      {containsLabels <= 0 ? (
        <EmptyComponent />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default ItemTypeFreqChart;
