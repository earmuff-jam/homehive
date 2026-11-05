import dayjs from "dayjs";

// normalizeTrendsChart ...
export function normalizeTrendsChart(draftInvoiceList = [], chartType = "") {
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

  return {
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
  };
}
