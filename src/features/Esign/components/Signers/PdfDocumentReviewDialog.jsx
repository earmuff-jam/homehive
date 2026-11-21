import React from "react";

import { Divider, Stack } from "@mui/material";
import PdfDocumentPreview from "features/Esign/components/PdfDocumentPreview/PdfDocumentPreview";
import PdfDocumentReviewBox from "features/Esign/components/PdfDocumentReviewBox/PdfDocumentReviewBox";
import PdfDocumentReviewSigners from "features/Esign/components/Signers/PdfDocumentReviewSigners";

const PdfDocumentReviewDialog = ({
  tokenCount = 0,
  signers = [],
  signatureBoxes = [],
  previewData,
  isCreateEsignDocumentLoading,
}) => {
  const acuteDateBoxes = signatureBoxes?.filter(
    (box) => box.fieldType === "date",
  );
  const acuteSignatureBoxes = signatureBoxes?.filter(
    (box) => box.fieldType === "signature",
  );
  const isRequiredFieldsMissing =
    signers?.length ===
      signers?.filter((signer) => signer?.email_address).length ||
    signers?.length !== signers?.filter((signer) => signer?.name).length;

  return (
    <Stack paddingTop="1rem" direction="row" gap={1}>
      <Stack flex={2} spacing={1}>
        <Stack spacing={1}>
          <PdfDocumentReviewBox
            isValid={acuteSignatureBoxes?.length === signers?.length}
            errorStr={`You have ${signers?.length} signers but ${acuteSignatureBoxes?.length} signature boxes. Is this correct?`}
            successStr={`Found ${acuteSignatureBoxes?.length} signature boxes.`}
          />
          <PdfDocumentReviewBox
            isValid={acuteDateBoxes?.length === signers?.length}
            errorStr={`You have ${signers?.length} signers but ${acuteDateBoxes?.length} date boxes. Is this correct?`}
            successStr={`Found ${acuteDateBoxes?.length} date boxes.`}
          />
          <PdfDocumentReviewBox
            isValid={isRequiredFieldsMissing}
            errorStr="Missing required fields. Please ensure full name and email is filled out for each signer including the Creator."
          />
          <PdfDocumentReviewBox
            isValid={tokenCount > 0}
            errorStr="Not enough tokens to send electronic signature"
          />
        </Stack>
        <Divider />
        <PdfDocumentReviewSigners signers={signers} />
      </Stack>
      <Stack flex={1}>
        <PdfDocumentPreview
          data={previewData}
          isLoading={isCreateEsignDocumentLoading}
        />
      </Stack>
    </Stack>
  );
};

export default PdfDocumentReviewDialog;
