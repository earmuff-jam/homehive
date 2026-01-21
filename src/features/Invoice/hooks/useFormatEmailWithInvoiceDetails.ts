import { parseJsonUtility } from "common/utils";
import { TInvoice, TInvoiceUserInfo } from "features/Invoice/Invoice.schema";

// useFormatEmailWithInvoiceDetails ...
export const useFormatEmailWithInvoiceDetails = () => {
  const data = parseJsonUtility<TInvoice>(localStorage.getItem("pdfDetails"));

  const draftRecieverUserInfo = parseJsonUtility<TInvoiceUserInfo>(
    localStorage.getItem("recieverInfo"),
  );

  const isDisabled = data === null;
  const draftInvoiceHeader = data?.header;
  const draftRecieverUserEmailAddress = draftRecieverUserInfo?.email;

  return {
    data,
    draftInvoiceHeader,
    draftRecieverUserEmailAddress,
    recieverInfo: draftRecieverUserInfo,
    isDisabled,
  };
};
