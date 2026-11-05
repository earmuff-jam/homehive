// normalizeItemTypeChart ...
// defines a function that is used to normalize the invoice item type chart dataset
export function normalizeItemTypeChart(draftInvoiceList = []) {
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
