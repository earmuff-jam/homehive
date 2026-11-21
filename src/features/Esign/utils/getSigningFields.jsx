// getSigningFields ...
// defines a function that creates new editable fields
export const getSigningFields = (formFields = []) => {
  if (formFields.length <= 0) {
    console.debug("Unable to generate signature boxes");
    return;
  }

  return formFields?.map((field, index) => ({
    document_index: 0,
    api_id: `sig_${index}`,
    type: field.fieldType === "date" ? "date" : "signature",
    signer:
      field?.signerId === "creator"
        ? 0
        : Number(field?.signerId?.split("_")[1]), // reads tenant_x number to determine the tenant number to sign
    page: field?.pageNum,
    x: field?.pdfX,
    y: field?.pdfY,
    width: field?.pdfW,
    height: field?.pdfH,
    required: true,
  }));
};

export const populateFinalFormData = (
  finalBytes,
  signatureBoxes,
  signers,
  user,
) => {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([finalBytes], { type: "application/pdf" }),
    "prepared-esign.pdf",
  );
  formData.append("fUrl", "0029_SendPreparedEsignDocument");
  formData.append("fMethod", "POST");
  formData.append("title", "Lease agreement");
  formData.append("subject", "Requesting electronic signature");
  formData.append("signers", JSON.stringify(signers));
  formData.append("userId", user?.uid);
  formData.append("stripeCustomerEmail", user?.email);
  formData.append(
    "message",
    "Please review and sign the provided document at your earliest convenience",
  );

  const formFields = getSigningFields(signatureBoxes);
  formData.append("formFieldsPerDocument", JSON.stringify(formFields));

  return formData;
};
