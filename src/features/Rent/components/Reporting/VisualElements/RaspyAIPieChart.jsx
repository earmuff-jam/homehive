import React, { useEffect, useState } from "react";

import { PolarArea } from "react-chartjs-2";

import { Box, alpha, useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();

  const [chartData, setChartData] = useState(null);

  const ltMediumFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      r: {
        ticks: {
          display: false,
          color: theme.palette.text.secondary,
          backdropColor: "transparent",
        },
        grid: {
          color: theme.palette.divider,
        },
        angleLines: {
          color: theme.palette.divider,
        },
        pointLabels: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  useEffect(() => {
    if (!data?.length) {
      setChartData(null);
      return;
    }

    const [labels = [], values = [], backgroundColors = []] = data;

    const themedBackgroundColors =
      backgroundColors.length > 0
        ? backgroundColors
        : [
            alpha(theme.palette.primary.main, 0.7),
            alpha(theme.palette.secondary.main, 0.7),
            alpha(theme.palette.error.main, 0.7),
            alpha(theme.palette.warning.main, 0.7),
            alpha(theme.palette.success.main, 0.7),
            alpha(theme.palette.info.main, 0.7),
          ];

    setChartData({
      labels,
      datasets: [
        {
          label: "Collected Rent",
          data: values,
          backgroundColor: themedBackgroundColors,
          borderColor: theme.palette.background.paper,
          borderWidth: 2,
        },
      ],
    });
  }, [data, theme]);

  return (
    <Box sx={{ height: "15rem", width: ltMediumFormFactor ? "100%" : "50%" }}>
      {!chartData ? (
        <EmptyComponent caption="Sorry, no matching records found." />
      ) : (
        <PolarArea data={chartData} options={options} />
      )}
    </Box>
  );
};

export default RaspyAIPieChart;
