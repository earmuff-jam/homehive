import React from "react";

import { useNavigate, useOutletContext } from "react-router-dom";

import dayjs from "dayjs";

import {
  CancelRounded,
  DeblurRounded,
  DraftsRounded,
  LocalAtmRounded,
  PaidRounded,
} from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { EditInvoiceRouteUri } from "common/utils";
import ReportTable from "features/Invoice/components/PdfViewer/ReportTable";
import Salutation from "features/Invoice/components/UserInfo/Salutation";
import { DefaultInvoiceStatusOptions } from "features/Invoice/constants";
import { useAppTitle } from "hooks/useAppTitle";

const DefaultInvoiceStatusIcons = {
  Paid: <PaidRounded fontSize="small" />,
  Draft: <DraftsRounded fontSize="small" />,
  Overdue: <LocalAtmRounded fontSize="small" />,
  Cancelled: <CancelRounded fontSize="small" />,
  None: <DeblurRounded fontSize="small" />,
};

export default function PdfViewer() {
  useAppTitle("View Invoice");

  const navigate = useNavigate();
  const [showWatermark] = useOutletContext();

  const senderInfo = JSON.parse(localStorage.getItem("senderInfo"));
  const recieverInfo = JSON.parse(localStorage.getItem("recieverInfo"));
  const pdfDetails = JSON.parse(localStorage.getItem("pdfDetails"));

  const invoiceStatusWithIcon = {
    ...pdfDetails?.invoiceStatus,
    icon: DefaultInvoiceStatusIcons[pdfDetails?.invoiceStatus?.label],
  };

  const handleNavigate = () => navigate(EditInvoiceRouteUri);

  return (
    <Container maxWidth="md" data-tour="view-pdf-0">
      {!pdfDetails ? (
        <EmptyComponent
          title="Sorry, no invoice found to display"
          caption="Create new invoice from"
        >
          <Typography
            component={"span"}
            variant="caption"
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={handleNavigate}
          >
            &nbsp;here.
          </Typography>
        </EmptyComponent>
      ) : (
        <Stack spacing={"2rem"}>
          {recieverInfo ? <Salutation userInfo={recieverInfo} /> : null}
          <RowHeader
            title={pdfDetails.title}
            caption={pdfDetails.caption}
            showDate={true}
            createdDate={dayjs(pdfDetails?.updatedOn?.fromNow).format(
              "DD-MM-YYYY",
            )}
          />
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            {`Period ${dayjs(pdfDetails.startDate)?.format(
              "MM-DD-YYYY",
            )} to ${dayjs(pdfDetails.endDate)?.format("MM-DD-YYYY")}`}
          </Typography>
          <ReportTable
            rows={pdfDetails?.lineItems}
            taxRate={pdfDetails?.taxRate}
            invoiceTitle={pdfDetails?.invoiceHeader}
            invoiceStatus={invoiceStatusWithIcon}
            showWatermark={showWatermark}
          />
          {pdfDetails?.note.length > 0 && (
            <Typography
              variant="caption"
              fontStyle="italic"
              fontWeight="medium"
            >
              Note: {pdfDetails?.note}
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
