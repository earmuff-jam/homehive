import React, { useEffect, useState } from "react";

import { PolarArea } from "react-chartjs-2";

import { Box } from "@mui/material";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import EmptyComponent from "common/EmptyComponent";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Title);

const RaspyAIPieChart = ({ label, data = [] }) => {
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
        display: false,
      },
      scales: {
        r: {
          ticks: {
            display: false, // hides the numbers
          },
          grid: {
            display: false, // optional: remove circular grid lines
          },
        },
      },
    },
  };

  useEffect(() => {
    const [labels, values, backgroundColors] = data;
    setChartData({
      labels,
      datasets: [
        {
          label: "Collected Rent",
          data: values,
          backgroundColor: backgroundColors,
        },
      ],
    });
  }, [data]);

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
        <PolarArea data={chartData} options={options} />
      )}
    </Box>
  );
};

export default RaspyAIPieChart;
