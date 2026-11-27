import getSigningFields from "./getSigningFields";

// getFinalFormData ...
// defines a function that is used to populate the final form data for signing purposes
const getFinalFormData = (finalBytes, signatureBoxes, signers, user) => {
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

export default getFinalFormData;
