import dayjs from "dayjs";

import {
  TInvoice,
  TInvoiceItemTypeChartData,
  TInvoiceRow,
  TItemTypeChartRow,
  TScatterChart,
} from "features/Invoice/Invoice.schema";
import { MonthTotal } from "features/Invoice/Invoice.types";

// formatNumber ...
// defines a function used to convert number to string with passed in trim count value, default 2
export const formatNumber = (
  amt: number = 0,
  trimCount: number = 2,
): string => {
  return amt.toFixed(trimCount);
};

// normalizeDetailsTableData ...
export function normalizeDetailsTableData(list: TInvoice[]): TInvoiceRow[] {
  return list.map((invoice) => {
    const items = invoice.lineItems || [];
    const total = items.reduce((sum, item) => sum + (item.payment || 0), 0);

    const category = [
      ...new Set(items.map((i) => i.category?.label).filter(Boolean)),
    ].join(" / ");

    const paymentMethod = [
      ...new Set(items.map((i) => i.paymentMethod).filter(Boolean)),
    ].join(" / ");

    return {
      category,
      invoiceStatus: invoice.invoiceStatus,
      startDate: invoice.startDate,
      endDate: invoice.endDate,
      total,
      paymentMethod,
      updatedOn: invoice.updatedOn,
    };
  });
}

// normalizeInvoiceItemTypeChartDataset ...
export function normalizeInvoiceItemTypeChartDataset(
  list: TInvoice[],
): TInvoiceItemTypeChartData {
  const itemCountMap = new Map<string, number>();
  const booleanFilteredList = list.filter(Boolean);

  if (booleanFilteredList.length > 0) {
    booleanFilteredList.forEach(({ lineItems = [] }) => {
      lineItems.forEach((item) => {
        const itemDescription = item?.category?.label || "Unknown Item";
        itemCountMap[itemDescription] =
          (itemCountMap[itemDescription] || 0) + 1;
      });
    });
  }

  const labels = Object.keys(itemCountMap);
  const frequencies = Object.values(itemCountMap);
  const datasets = [
    {
      label: "Item Type Frequency",
      data: frequencies,
      backgroundColor: "rgba(153, 102, 255, 0.7)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 1,
      fill: false,
      tension: 0,
    },
  ];

  return {
    labels,
    datasets,
  };
}

// normalizeInvoiceTrendsChartsDataset ...
export function normalizeInvoiceTrendsChartsDataset(
  list: TInvoice[],
  chartType: string,
): TScatterChart[] {
  const monthMap = new Map<string, MonthTotal>();
  const booleanFilteredList = list.filter(Boolean);

  booleanFilteredList.forEach((invoice) => {
    const month = dayjs(invoice.startDate).format("MMMM");
    const taxRate = Number(invoice.taxRate || 0);

    const collectedTotal = invoice?.lineItems?.reduce((acc, item) => {
      return acc + Number(item?.payment || 0);
    }, 0);

    const taxCollected = parseFloat(
      ((collectedTotal * taxRate) / 100).toFixed(2),
    );

    if (!monthMap.has(month)) {
      monthMap.set(month, {
        collected: 0,
        tax: 0,
      });
    }

    const current = monthMap.get(month);
    monthMap.set(month, {
      collected: current.collected + collectedTotal,
      tax: current.tax + taxCollected,
    });
  });

  const labels = Array.from(monthMap.keys());
  const collectedData = Array.from(monthMap.values()).map(
    (val) => val.collected,
  );
  const taxData = Array.from(monthMap.values()).map((val) => val.tax);

  return [
    {
      labels,
      datasets: [
        {
          label: "Collected Invoice",
          data: collectedData,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          fill: chartType === "line",
          tension: 0.4,
          borderWidth: 0,
        },
        {
          label: "Tax Collected",
          data: taxData,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          fill: chartType === "line",
          tension: 0.4,
          borderWidth: 0,
        },
      ],
    },
  ];
}

// normalizeInvoiceTimelineChartDataset ...
export function normalizeInvoiceTimelineChartDataset(
  list: TInvoice[],
): TScatterChart {
  const months = new Set<string>();
  const booleanFilteredList = list.filter(Boolean);

  booleanFilteredList.forEach((invoice) => {
    const month = dayjs(invoice.startDate).format("MMMM");
    months.add(month);
  });

  const monthLabels = Array.from(months);

  const datasets: TItemTypeChartRow[] = booleanFilteredList.map(
    (invoice, id) => {
      const month = dayjs(invoice.startDate).format("MMMM");
      const index = monthLabels.indexOf(month);

      const duration = dayjs(invoice.endDate).diff(invoice.startDate, "day");
      const data = monthLabels.map((_, idx) =>
        idx === index ? duration : null,
      );

      return {
        label: `Payment: $${invoice.lineItems?.[0]?.payment} via ${invoice.lineItems?.[0]?.paymentMethod}`,
        data,
        backgroundColor: id % 2 === 0 ? "#4CAF50" : "rgba(255, 99, 132, 0.7)",
        borderWidth: 1,
        fill: false,
        tension: 0,
        borderColor: "",
      };
    },
  );

  return {
    labels: monthLabels,
    datasets,
  };
}
