import { parseJsonUtility } from "common/utils";
import { Invoice, UserInfo } from "features/Invoice/types/Invoice.types";

// useFormatEmailWithInvoiceDetails ...
export const useFormatEmailWithInvoiceDetails = () => {
  const data = parseJsonUtility<Invoice>(localStorage.getItem("pdfDetails"));

  const draftRecieverUserInfo = parseJsonUtility<UserInfo>(
    localStorage.getItem("recieverInfo"),
  );

  const isDisabled = data === null;
  const draftInvoiceHeader = data.header;
  const draftRecieverUserEmailAddress = draftRecieverUserInfo?.email;

  return {
    data,
    draftInvoiceHeader,
    draftRecieverUserEmailAddress,
    recieverInfo: draftRecieverUserInfo,
    isDisabled,
  };
};
