import dayjs from "dayjs";

import {
  Invoice,
  InvoiceItemTypeChartData,
  InvoiceRow,
  ItemTypeChartRow,
  MonthTotal,
  TrendsChartDataset,
} from "features/Invoice/types/Invoice.types";

/**
 * The function `normalizeDetailsTableData` takes an array of invoices, calculates total payment
 * amounts, and returns normalized data for a details table.
 * @param {Invoice[]} draftInvoiceList - The `noramlizeDetailsTableData` function takes an array of
 * `Invoice` objects called `draftInvoiceList` as input and returns an array of `InvoiceRow` objects.
 * @returns The function `normalizeDetailsTableData` takes an array of `Invoice` objects called
 * `draftInvoiceList` as input and returns an array of `InvoiceRow` objects. Each `InvoiceRow` object
 * contains normalized data from the corresponding `Invoice` object in the input array, including
 * category, invoice status, start date, end date, total payment, payment method, and updated on date.
 */
export function noramlizeDetailsTableData(
  draftInvoiceList: Invoice[],
): InvoiceRow[] {
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

/**
 * The function `normalizeInvoiceItemTypeChartDataset` takes a list of invoices, extracts item types
 * from line items, and generates a chart dataset showing the frequency of each item type.
 * @param {Invoice[]} list - The `normalizeInvoiceItemTypeChartDataset` function takes a list of
 * invoices as input and generates a chart dataset for visualizing the frequency of different item
 * types within those invoices. The function iterates over the list of invoices, extracts the item
 * types from each invoice's line items, and counts the frequency of
 * @returns The function `normalizeInvoiceItemTypeChartDataset` returns an object with two properties:
 * `labels` and `datasets`. The `labels` property contains an array of unique item descriptions
 * extracted from the input list of invoices. The `datasets` property contains an array with a single
 * object representing the dataset for the item type frequency chart. This object includes the label
 * for the dataset, an array of frequencies corresponding to
 */
export function normalizeInvoiceItemTypeChartDataset(
  list: Invoice[],
): InvoiceItemTypeChartData {
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

/**
 * The function `normalizeInvoiceTrendsChartsDataset` processes a list of invoices to generate data for
 * trends charts displaying collected invoice amounts and tax collected per month.
 * @param {Invoice[]} list - The `list` parameter is an array of `Invoice` objects containing
 * information about invoices, such as start date, line items, and tax rate.
 * @param {string} chartType - The `chartType` parameter in the `normalizeInvoiceTrendsChartsDataset`
 * function is used to determine the type of chart to be generated. It can have two possible values:
 * "line" or any other value. If `chartType` is "line", the generated chart will be a line
 * @returns The `normalizeInvoiceTrendsChartsDataset` function returns an array containing a single
 * object with `labels` and `datasets` properties. The `labels` property contains an array of month
 * names, while the `datasets` property contains an array of two objects representing the collected
 * invoice data and tax collected data. Each dataset object includes properties like `label`, `data`,
 * `backgroundColor`, `borderColor`,
 */
export function normalizeInvoiceTrendsChartsDataset(
  list: Invoice[],
  chartType: string,
): TrendsChartDataset[] {
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

/**
 * The function `normalizeInvoiceTimelineChartDataset` takes a list of invoices, extracts the month
 * from each invoice's start date, and creates a dataset for a trends chart with payment information.
 * @param {Invoice[]} list - The `normalizeInvoiceTimelineChartDataset` function takes a list of
 * invoices as input and normalizes the data to create a TrendsChartDataset for displaying in a chart.
 * The function processes the list of invoices to extract relevant information and structure it in a
 * format suitable for displaying on a timeline chart.
 * @returns The function `normalizeInvoiceTimelineChartDataset` returns a `TrendsChartDataset` object,
 * which contains an array of month labels and an array of datasets. Each dataset represents an invoice
 * with information such as payment amount, payment method, and duration of payment.
 */
export function normalizeInvoiceTimelineChartDataset(
  list: Invoice[],
): TrendsChartDataset {
  const months = new Set<string>();
  const booleanFilteredList = list.filter(Boolean);

  booleanFilteredList.forEach((invoice) => {
    const month = dayjs(invoice.startDate).format("MMMM");
    months.add(month);
  });

  const monthLabels = Array.from(months);

  const datasets: ItemTypeChartRow[] = booleanFilteredList.map(
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

/**
 * The `parseJsonUtility` function parses a JSON string into a specified type and returns the parsed
 * value or null if parsing fails.
 * @param {string | null} value - The `value` parameter in the `parseJsonUtility` function is a string
 * that represents a JSON object or `null`. The function attempts to parse the string as JSON and
 * return the parsed object of type `T`. If parsing fails or if the `value` is `null`, the function
 * returns
 * @returns The `parseJsonUtility` function returns a value of type `T` or `null`. If the input `value`
 * is falsy (null, undefined, etc.), it returns `null`. If the input `value` can be successfully parsed
 * as JSON of type `T`, it returns the parsed value as type `T`. If there is an error during parsing,
 * it returns `null`.
 */
export function parseJsonUtility<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
