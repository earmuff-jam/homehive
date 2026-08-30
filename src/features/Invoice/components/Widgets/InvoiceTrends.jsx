import React, { useState } from "react";

import { Bar, Line } from "react-chartjs-2";

import { BarChartRounded, StackedLineChartRounded } from "@mui/icons-material";
import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
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
import { normalizeInvoiceTrendsChartsDataset } from "features/Invoice/utils";

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

// ChartType ...
// defines the type of chart to render
const ChartType = {
  Bar: "bar",
  Line: "line",
};

const InvoiceTrendsChart = ({ data = [] }) => {
  const [chartType, setChartType] = useState(ChartType.Bar);

  const handleChartType = (ev, draftChartType) => {
    if (draftChartType !== null) {
      setChartType(draftChartType);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
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

  const chartData = normalizeInvoiceTrendsChartsDataset(data, chartType);
  console.log(chartData);
  return (
    <Stack data-tour="dashboard-5">
      <Stack>
        <Box>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartType}
            aria-label="bar or line chart"
          >
            <ToggleButton
              value={ChartType.Bar}
              aria-label="bar chart"
              size="small"
            >
              <BarChartRounded fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value={ChartType.Line}
              aria-label="line chart"
              size="small"
            >
              <StackedLineChartRounded fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
      <Box>
        {chartData === null ? (
          <EmptyComponent />
        ) : chartType === ChartType.Bar ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </Box>
    </Stack>
  );
};

export default InvoiceTrendsChart;
