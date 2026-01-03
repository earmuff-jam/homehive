import React, { useEffect, useState } from "react";

import { Bar, Line } from "react-chartjs-2";

import { BarChartRounded, StackedLineChartRounded } from "@mui/icons-material";
import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader/RowHeader";
import {
  ChartType,
  Invoice,
  TrendsChartDataset,
} from "features/Invoice/types/Invoice.types";
import {
  normalizeInvoiceTrendsChartsDataset,
  parseJsonUtility,
} from "features/Invoice/utils";

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

// InvoiceTrendsChartProps ...
type InvoiceTrendsChartProps = {
  label: string;
  caption: string;
};

const InvoiceTrendsChart = ({ label, caption }: InvoiceTrendsChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartData, setChartData] = useState<TrendsChartDataset>(null);

  const handleChartType = (
    ev: React.MouseEvent<HTMLButtonElement>,
    type: ChartType,
  ) => {
    if (type !== null) {
      setChartType(type);
    }
  };

  useEffect(() => {
    const draftData = parseJsonUtility<Invoice>(
      localStorage.getItem("pdfDetails"),
    );
    if (draftData) {
      const chartData = normalizeInvoiceTrendsChartsDataset(
        [draftData],
        chartType,
      );
      setChartData(chartData[0]);
    }
  }, [chartType]);

  const options: ChartOptions<"bar" | "line"> = {
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
              <BarChartRounded fontSize="small" />
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart" size="small">
              <StackedLineChartRounded fontSize="small" />
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
