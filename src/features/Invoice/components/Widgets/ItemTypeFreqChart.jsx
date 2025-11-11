import React, { useEffect, useState } from "react";

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
import RowHeader from "common/RowHeader/RowHeader";
import { normalizeInvoiceItemTypeChartDataset } from "features/Invoice/utils";

normalizeInvoiceItemTypeChartDataset;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
);

const ItemTypeFreqChart = ({ label, caption }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const draftData = JSON.parse(localStorage.getItem("pdfDetails"));
    if (draftData) {
      const chartData = normalizeInvoiceItemTypeChartDataset([draftData]);
      setChartData(chartData);
    }
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
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

  return (
    <Stack data-tour={"dashboard-6"}>
      <RowHeader
        title={label}
        caption={caption}
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
      />
      {Object.keys(chartData).length <= 0 ? (
        <EmptyComponent />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </Stack>
  );
};

export default ItemTypeFreqChart;
