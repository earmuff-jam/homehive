import React, { useEffect, useState } from "react";

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
import RowHeader from "common/RowHeader/RowHeader";
import { normalizeInvoiceTrendsChartsDataset } from "features/Invoice/components/Widgets/utils";

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

const InvoiceTrendsChart = ({ label, caption }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("bar"); // or "line"

  const handleChartType = (ev, draftChartType) => {
    if (draftChartType !== null) {
      setChartType(draftChartType);
    }
  };

  useEffect(() => {
    const draftData = JSON.parse(localStorage.getItem("pdfDetails"));
    if (draftData) {
      const chartData = normalizeInvoiceTrendsChartsDataset(
        [draftData],
        chartType,
      );
      setChartData(chartData[0]);
    }
  }, [chartType]);

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

  return (
    <Stack data-tour={"dashboard-5"}>
      <Stack direction="row" justifyContent="space-between">
        <RowHeader
          title={label}
          caption={caption}
          sxProps={{
            textAlign: "left",
            fontWeight: "bold",
            color: "text.secondary",
          }}
        />

        <Box>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartType}
            aria-label="bar or line chart"
          >
            <ToggleButton value="bar" aria-label="bar chart" size="small">
              <BarChartRounded />
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart" size="small">
              <StackedLineChartRounded />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>

      <Box>
        {chartData === null ? (
          <EmptyComponent />
        ) : chartType === "bar" ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </Box>
    </Stack>
  );
};

export default InvoiceTrendsChart;
