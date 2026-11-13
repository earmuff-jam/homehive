import React from "react";

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
