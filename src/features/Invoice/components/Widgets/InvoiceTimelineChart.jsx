import React from "react";

import { Bar } from "react-chartjs-2";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import {
  BarElement,
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-dayjs-4";
import EmptyComponent from "common/EmptyComponent";
import { normalizeInvoiceTimelineChartDataset } from "features/Invoice/utils";

ChartJS.register(TimeScale, LinearScale, BarElement, Tooltip, Title);

const InvoiceTimelineChart = ({ data = [] }) => {
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Invoice Timeline",
      },
      tooltip: {
        displayColors: false,

        callbacks: {
          title: () => "",
          label: (context) => context.dataset.label,
          afterLabel: (context) => {
            const { raw } = context;

            return [
              `Start: ${dayjs(raw.startDate).format("MMM D, YYYY")}`,
              `End: ${dayjs(raw.endDate).format("MMM D, YYYY")}`,
              `Duration: ${raw.duration} days`,
            ];
          },
        },
      },
    },

    scales: {
      x: {
        type: "time",
        title: {
          display: true,
          text: "Date",
        },
        time: {
          unit: "month",
          displayFormats: {
            month: "MMM YY",
          },
        },
      },
      y: {
        display: false,
      },
    },
  };

  const chartData = normalizeInvoiceTimelineChartDataset(data);

  return (
    <Stack data-tour="dashboard-5">
      {data?.length <= 0 ? (
        <EmptyComponent />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default InvoiceTimelineChart;
