// normalizeTableData ...
// defines a function that normalizes the table data
export function normalizeTableData(draftInvoiceList = []) {
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
      note: invoice?.note || "",
      updatedOn: invoice.updatedOn,
    };
  });
}
