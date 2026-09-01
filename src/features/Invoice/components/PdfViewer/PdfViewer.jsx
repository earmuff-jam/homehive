import React, { useEffect, useState } from "react";

import { useNavigate, useOutletContext } from "react-router-dom";

import dayjs from "dayjs";

import { EmailOutlined, PrintRounded } from "@mui/icons-material";
import { Container, Skeleton, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { EditInvoiceRouteUri, isSelectedFeatureEnabled } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useGetInvoiceListQuery } from "features/Api/invoiceApi";
import InvoiceSelector from "features/Invoice/components/InvoiceSelector/InvoiceSelector";
import ReportTable from "features/Invoice/components/PdfViewer/ReportTable";
import Salutation from "features/Invoice/components/UserInfo/Salutation";
import { DefaultInvoiceStatusIcons } from "features/Invoice/constants";
import withDialog from "features/Invoice/withDialog";
import { generateInvoiceHTML } from "features/Layout/utils";
import { useAppTitle } from "hooks/useAppTitle";

const PdfViewer = ({ setDialog }) => {
  useAppTitle("View Invoice");

  const navigate = useNavigate();
  const [showWatermark, setOpenDrawer] = useOutletContext();
  const isEmailEnabled = isSelectedFeatureEnabled("sendEmail");

  const { data: invoiceList, isLoading: isInvoiceListLoading } =
    useGetInvoiceListQuery();

  const [
    sendEmail,
    {
      isLoading: isSendEmailLoading,
      isSuccess: isSendEmailSuccess,
      isError: isSendEmailError,
    },
  ] = useSendEmailMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const invoiceDetails = invoiceList?.invoiceDetails;

  const senderDetail = invoiceList?.senderDetails?.find(
    (el) => el.invoiceID === selectedInvoice,
  );

  const receiverDetail = invoiceList?.receiverDetails?.find(
    (el) => el.invoiceID === selectedInvoice,
  );

  const invoiceDetail = invoiceDetails?.find(
    (invoice) => invoice.id === selectedInvoice,
  );

  const handleNavigate = () => navigate(EditInvoiceRouteUri);

  const handlePrint = () => {
    setOpenDrawer(false);
    setDialog({
      title:
        "Verify all information is correct before proceeding to print. Press print when ready.",
      label: "Verify Information",
      type: "PRINT",
      display: true,
      showWatermark: false,
    });
  };

  const handleSendEmail = () => {
    const invoiceHeader = invoiceDetail?.invoiceHeader;
    const invoiceStatusLabel = invoiceDetail?.invoiceStatus?.label;

    sendEmail({
      to: receiverDetail?.email,
      subject: invoiceHeader
        ? `Invoice Details - ${invoiceHeader}`
        : "Invoice Details",
      text: "Please view your attached invoice.",
      html: generateInvoiceHTML(
        receiverDetail,
        invoiceDetail,
        invoiceStatusLabel,
      ),
    });
  };

  const shouldPreventEmail =
    isSendEmailLoading ||
    !selectedInvoice ||
    invoiceDetail?.lineItems?.length <= 0 ||
    !receiverDetail?.email;

  const invoiceStatusWithIcon = {
    ...invoiceDetail?.invoiceStatus,
    icon: DefaultInvoiceStatusIcons[invoiceDetail?.invoiceStatus?.label],
  };

  useEffect(() => {
    if (isSendEmailSuccess || isSendEmailError) {
      setShowSnackbar(true);
    }
  }, [isSendEmailLoading]);

  if (isInvoiceListLoading) return <Skeleton height="10rem" />;

  return (
    <Container maxWidth="md" data-tour="view-pdf-0">
      {invoiceDetails?.length <= 0 ? (
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
        <Stack spacing={1}>
          <Stack
            spacing={1}
            direction="row"
            className="no-print"
            justifyContent="space-between"
          >
            <Stack>
              <Typography variant="h5" color="text.secondary" fontWeight="bold">
                View Invoice
              </Typography>
              <Typography variant="subtitle2">
                {selectedInvoice
                  ? `View invoice details for ${invoiceDetail?.invoiceHeader}`
                  : "Select an invoice to begin"}
              </Typography>
            </Stack>
            <Stack justifyContent="flex-end" spacing={1} data-tour="view-pdf-1">
              <InvoiceSelector
                hideCreateNewSelector
                inputLabel="Select Invoice"
                selectedInvoice={selectedInvoice}
                setSelectedInvoice={setSelectedInvoice}
                options={invoiceDetails}
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
                spacing={1}
                data-tour="view-pdf-2"
              >
                <AButton
                  size="small"
                  disabled={!selectedInvoice}
                  aria-label="Print invoice"
                  endIcon={<PrintRounded fontSize="small" />}
                  onClick={handlePrint}
                  label="Print"
                  variant="outlined"
                />
                {isEmailEnabled && (
                  <AButton
                    size="small"
                    disabled={shouldPreventEmail}
                    aria-label="Email invoice"
                    endIcon={<EmailOutlined fontSize="small" />}
                    onClick={handleSendEmail}
                    label="Send email"
                    variant="contained"
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
          {selectedInvoice ? (
            <Stack spacing={1}>
              {receiverDetail ? <Salutation userInfo={receiverDetail} /> : null}
              <RowHeader
                title={invoiceDetail.title}
                caption={invoiceDetail.caption}
                showDate={true}
                createdDate={dayjs(invoiceDetail?.updatedOn?.fromNow).format(
                  "DD-MM-YYYY",
                )}
              />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {`Period ${dayjs(invoiceDetail.startDate)?.format(
                  "MM-DD-YYYY",
                )} to ${dayjs(invoiceDetail.endDate)?.format("MM-DD-YYYY")}`}
              </Typography>
              <ReportTable
                rows={invoiceDetail?.lineItems}
                taxRate={invoiceDetail?.taxRate}
                invoiceTitle={invoiceDetail?.invoiceHeader}
                invoiceStatus={invoiceStatusWithIcon}
                showWatermark={showWatermark}
              />
              {invoiceDetail?.note.length > 0 && (
                <Typography
                  variant="caption"
                  fontStyle="italic"
                  fontWeight="medium"
                >
                  Note: {invoiceDetail?.note}
                </Typography>
              )}
              {senderDetail ? (
                <Salutation isEnd={true} userInfo={senderDetail} />
              ) : null}
            </Stack>
          ) : (
            <EmptyComponent caption="Select an invoice to begin" />
          )}
        </Stack>
      )}
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        severity={isSendEmailSuccess ? "success" : "error"}
        title={
          isSendEmailSuccess
            ? "Email sent successfully. Check spam if necessary."
            : "Error sending email."
        }
      />
    </Container>
  );
};

export default withDialog(PdfViewer);
