import dayjs from "dayjs";

// normalizeTimelineChart ...
export function normalizeTimelineChart(invoices = []) {
  const filteredInvoices = invoices.filter(Boolean);

  const datasets = filteredInvoices.map((invoice, id) => {
    const startDate = dayjs(invoice.startDate);
    const endDate = dayjs(invoice.endDate);

    const duration = endDate.diff(startDate, "day");

    return {
      label: `Payment: $${invoice.lineItems?.[0]?.payment} USD`,

      data: [
        {
          x: [startDate.toDate(), endDate.toDate()],
          y: id,
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          duration,
        },
      ],

      backgroundColor: id % 2 === 0 ? "#4CAF50" : "rgba(255, 99, 132, 0.7)",

      borderWidth: 1,
    };
  });

  return {
    datasets,
  };
}
