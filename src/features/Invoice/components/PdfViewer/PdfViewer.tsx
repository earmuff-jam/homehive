import { useNavigate, useOutletContext } from "react-router-dom";

import dayjs from "dayjs";

import { Container, Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import { EditInvoiceRouteUri, parseJsonUtility } from "common/utils";
import {
  TInvoiceSchema,
  TInvoiceUserInfoSchema,
} from "features/Invoice/Invoice.schema";
import { TOutletContext } from "features/Invoice/Invoice.types";
import ReportTable from "features/Invoice/components/PdfViewer/ReportTable";
import RowHeader from "features/Invoice/components/RowHeader/InvoiceRowHeader";
import Salutation from "features/Invoice/components/UserInfo/Salutation";
import { useAppTitle } from "hooks/useAppTitle";

export default function PdfViewer() {
  useAppTitle("View Invoice");

  const navigate = useNavigate();
  const { showWatermark } = useOutletContext<TOutletContext>();

  const draftSenderInfo = parseJsonUtility<unknown>(
    localStorage.getItem("senderInfo"),
  );
  const draftRecieverInfo = parseJsonUtility<unknown>(
    localStorage.getItem("recieverInfo"),
  );
  const draftInvoiceForm = parseJsonUtility<unknown>(
    localStorage.getItem("pdfDetails"),
  );

  const parsedInvoice = TInvoiceSchema.safeParse(draftInvoiceForm);
  const parsedSenderInfo = TInvoiceUserInfoSchema.safeParse(draftSenderInfo);
  const parsedRecieverInfo =
    TInvoiceUserInfoSchema.safeParse(draftRecieverInfo);
  const invoiceForm = parsedInvoice.success ? parsedInvoice.data : null;
  const senderInfo = parsedSenderInfo.success ? parsedSenderInfo.data : null;
  const recieverInfo = parsedRecieverInfo.success
    ? parsedRecieverInfo.data
    : null;

  return (
    <Container maxWidth="md" data-tour="view-pdf-0">
      {!invoiceForm ? (
        <EmptyComponent
          title="Sorry, no invoice found to display"
          caption="Create new invoice from"
        >
          <Typography
            component={"span"}
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(EditInvoiceRouteUri)}
          >
            here.
          </Typography>
        </EmptyComponent>
      ) : (
        <Stack spacing={"2rem"}>
          {recieverInfo ? <Salutation userInfo={recieverInfo} /> : null}
          <RowHeader
            title={invoiceForm.title}
            caption={invoiceForm.caption}
            showDate={true}
            createdDate={dayjs(invoiceForm?.updatedOn)}
          />
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            {`Period ${dayjs(invoiceForm.startDate)?.format(
              "MM-DD-YYYY",
            )} to ${dayjs(invoiceForm.endDate)?.format("MM-DD-YYYY")}`}
          </Typography>
          <ReportTable
            rows={invoiceForm.lineItems}
            showWatermark={showWatermark}
            taxRate={invoiceForm.taxRate}
            invoiceTitle={invoiceForm.header}
            invoiceStatus={invoiceForm.invoiceStatus}
          />
          {invoiceForm.note.length > 0 && (
            <Typography
              variant="caption"
              fontStyle="italic"
              fontWeight="medium"
            >
              Note: {invoiceForm.note}
            </Typography>
          )}
          {senderInfo ? (
            <Salutation isEnd={true} userInfo={senderInfo} />
          ) : null}
        </Stack>
      )}
    </Container>
  );
}
