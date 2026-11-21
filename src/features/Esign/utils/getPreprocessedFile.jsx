// getPreprocessedFile ...
// defines a function that converts url into readable pdf
export const getPreprocessedFile = async (url, fileName) => {
  const res = await fetch(url);
  const blob = await res.blob();

  const readableFile = new File([blob], fileName, {
    type: "application/pdf",
  });

  return readableFile;
};
