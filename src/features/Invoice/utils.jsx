import dayjs from "dayjs";

// noramlizeDetailsTableData ...
// defines a function that normalizes the table data
export function noramlizeDetailsTableData(draftInvoiceList = []) {
  return draftInvoiceList.map((invoice) => {
    const items = invoice.lineItems || [];

    const total = items.reduce(
      (sum, item) => sum + Number(item.payment || 0),
      0,
    );

    const category = [
      ...new Set(items.map((i) => i.category?.label).filter(Boolean)),
    ].join(" / ");

    const paymentMethod = [
      ...new Set(items.map((i) => i.paymentMethod).filter(Boolean)),
    ].join(" / ");

    return {
      category,
      invoiceStatus: invoice.invoiceStatus || "",
      startDate: invoice.startDate,
      endDate: invoice.endDate,
      total,
      paymentMethod,
      updatedOn: invoice.updatedOn,
    };
  });
}

// normalizeInvoiceItemTypeChartDataset ...
// defines a function that is used to normalize the invoice item type chart dataset
export function normalizeInvoiceItemTypeChartDataset(draftInvoiceList = []) {
  const itemCountMap = {};

  const filteredDraftInvoiceList = draftInvoiceList.filter(Boolean); // remove unwanted values
  if (filteredDraftInvoiceList.length > 0) {
    filteredDraftInvoiceList.forEach(({ lineItems = [] }) => {
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
    },
  ];

  return {
    labels,
    datasets,
  };
}

// normalizeInvoiceTrendsChartsDataset ...
export function normalizeInvoiceTrendsChartsDataset(
  draftInvoiceList = [],
  chartType = "",
) {
  const monthMap = new Map();

  const filteredDraftInvoiceList = draftInvoiceList.filter(Boolean); // remove unwanted values

  filteredDraftInvoiceList.forEach((invoice) => {
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
        },
        {
          label: "Tax Collected",
          data: taxData,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          fill: chartType === "line",
          tension: 0.4,
        },
      ],
    },
  ];
}

// normalizeInvoiceTimelineChartDataset ...
export function normalizeInvoiceTimelineChartDataset(draftInvoiceList = []) {
  const months = new Set();
  const filteredDraftInvoiceList = draftInvoiceList.filter(Boolean); // remove unwanted values

  filteredDraftInvoiceList.forEach((invoice) => {
    const month = dayjs(invoice.startDate).format("MMMM");
    months.add(month);
  });

  const monthLabels = Array.from(months);

  const datasets = draftInvoiceList.map((invoice, id) => {
    const month = dayjs(invoice.startDate).format("MMMM");
    const index = monthLabels.indexOf(month);

    const duration = dayjs(invoice.endDate).diff(invoice.startDate, "day");
    const data = monthLabels.map((_, idx) => (idx === index ? duration : null));

    return {
      label: `Payment: $${invoice.lineItems?.[0]?.payment} via ${invoice.lineItems?.[0]?.paymentMethod}`,
      data,
      backgroundColor: id % 2 === 0 ? "#4CAF50" : "rgba(255, 99, 132, 0.7)",
      borderWidth: 1,
    };
  });

  return {
    labels: monthLabels,
    datasets,
  };
}
