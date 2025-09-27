/**
 * useLocalStorageData
 *
 * function used to retrieve selected data fields from local storage if they exist.
 */
export const useLocalStorageData = () => {
  const data = JSON.parse(localStorage.getItem("pdfDetails"));

  const draftInvoiceStatus = JSON.parse(localStorage.getItem("invoiceStatus"));

  const draftRecieverUserInfo = JSON.parse(
    localStorage.getItem("recieverInfo"),
  );

  const isDisabled = data === null;
  const draftInvoiceHeader = data?.invoice_header || "";
  const draftInvoiceStatusLabel = draftInvoiceStatus?.label || "";
  const draftRecieverUserEmailAddress =
    draftRecieverUserInfo?.email_address || "";

  const formattedData = Object.assign(
    {},
    {
      ...data,
      invoiceStatus: draftInvoiceStatus,
      recieverInfo: draftRecieverUserInfo,
    },
  );

  return {
    data: formattedData,
    draftInvoiceHeader,
    draftInvoiceStatusLabel,
    draftRecieverUserEmailAddress,
    recieverInfo: draftRecieverUserInfo,
    isDisabled,
  };
};
