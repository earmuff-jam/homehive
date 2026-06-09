import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";

import { Box, alpha, useMediaQuery, useTheme } from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  Legend,
);

const SeriesChart = ({ label, data = {} }) => {
  const theme = useTheme();

  const [chartData, setChartData] = useState(null);

  const ltMediumFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
    plugins: {
      title: {
        display: true,
        text: label,
        color: theme.palette.text.primary,
      },
      legend: {
        display: true,
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: theme.palette.text.secondary,
          maxTicksLimit: 5,
          callback: (value) => {
            return value >= 1000
              ? `$${(value / 1000).toFixed(1)}k`
              : `$${value}`;
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  useEffect(() => {
    if (!data) return;

    const { labels = [], historical = [], forecast = [] } = data;

    if (!labels.length) {
      setChartData(null);
      return;
    }

    const historicalDataset = labels.map((_, i) =>
      historical[i] !== undefined ? historical[i] : null,
    );

    const forecastDataset = labels.map((_, i) =>
      forecast[i] !== undefined ? forecast[i] : null,
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Rent History",
          data: historicalDataset,
          borderWidth: 2,
          tension: 0.4,
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
        },
        {
          label: "Rent Forecast",
          data: forecastDataset,
          borderWidth: 2,
          tension: 0.4,
          borderColor: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.3),
          borderDash: [6, 4],
        },
      ],
    });
  }, [data, label, theme]);

  return (
    <Box sx={{ height: "25rem", width: ltMediumFormFactor ? "100%" : "50%" }}>
      {chartData ? <Line data={chartData} options={options} /> : null}
    </Box>
  );
};

export default SeriesChart;
