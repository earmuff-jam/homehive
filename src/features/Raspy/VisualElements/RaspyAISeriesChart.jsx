import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";

import { Box } from "@mui/material";
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

const RaspyAISeriesChart = ({ label, data = {} }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
    plugins: {
      title: {
        display: true,
        text: label,
      },
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          maxTicksLimit: 5,
          callback: (value) => {
            return value >= 1000
              ? `$${(value / 1000).toFixed(1)}k`
              : `$${value}`;
          },
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
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.3)",
        },
        {
          label: "Rent Forecast",
          data: forecastDataset,
          borderWidth: 2,
          tension: 0.4,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          borderDash: [6, 4],
        },
      ],
    });
  }, [data, label]);

  return (
    <Box sx={{ height: "15rem", width: "50%" }}>
      {chartData ? <Line data={chartData} options={options} /> : null}
    </Box>
  );
};

export default RaspyAISeriesChart;
