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
import EmptyComponent from "common/EmptyComponent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
  Legend,
);

const RaspyAISeriesChart = ({ label, data = [] }) => {
  const [chartData, setChartData] = useState(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          precision: 0,
        },
      },
    },
  };

  useEffect(() => {
    const [labels = [], historicalValues = [], forecast = []] = data;
    setChartData({
      labels,
      datasets: [
        {
          label: "Rent history",
          data: historicalValues,
          borderWidth: 2,
          tension: 0.4,
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          borderColor: "rgba(153, 102, 255, 1)",
        },
        {
          label: "Rent Forecast",
          data: [...Array(historicalValues.length).fill(null), ...forecast],
          borderWidth: 2,
          tension: 0.4,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    });
  }, []);

  return (
    <Box
      sx={{
        height: "15rem",
        width: "50%",
      }}
    >
      {!chartData ? (
        <EmptyComponent caption="Sorry, no matching records found." />
      ) : (
        <Line data={chartData} options={options} />
      )}
    </Box>
  );
};

export default RaspyAISeriesChart;
