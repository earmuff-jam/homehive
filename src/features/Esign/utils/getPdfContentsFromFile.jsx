// getPdfContentsFromURL ...
// defines a function that is used to read esign pdf contents from firestore
export const getPdfContentsFromURL = async (url, fileName) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download selected file: ${res.status}`);
  }

  const blob = await res.blob();

  return new File([blob], fileName, {
    type: "application/pdf",
  });
};
