// useRetrieveInvoiceDetails ...
// defines a function to return invoice details
export const useRetrieveInvoiceDetails = () => {
  const data = JSON.parse(localStorage.getItem("pdfDetails"));
  const draftInvoiceStatus = JSON.parse(localStorage.getItem("invoiceStatus"));
  const draftRecieverUserInfo = JSON.parse(
    localStorage.getItem("recieverInfo"),
  );

  const isDisabled = data === null;
  const draftInvoiceHeader = data?.invoiceHeader || "";
  const draftInvoiceStatusLabel = draftInvoiceStatus?.label || "";
  const draftRecieverUserEmailAddress = draftRecieverUserInfo?.email || "";

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
