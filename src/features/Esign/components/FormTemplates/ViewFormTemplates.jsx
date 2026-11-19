import React from "react";

import { Button, Stack } from "@mui/material";
import { getPreprocessedFile } from "features/Esign/utils/getPreprocessedFile";

// DefaultFormTemplates ...
// defines some default templates
export const DefaultFormTemplates = [
  {
    id: "form_1",
    name: "Lease Agreement",
    fileName: "lease-agreement.pdf",
    url: "/forms/residential-lease.pdf",
  },
  {
    id: "form_2",
    name: "Lease Extension",
    fileName: "lease-extension.pdf",
    url: "/forms/residential-lease-extension.pdf",
  },
  {
    id: "form_3",
    name: "Early Termination",
    fileName: "early-termination.pdf",
    url: "/forms/residential-lease-early-termination.pdf",
  },
  {
    id: "form_4",
    name: "Lease Renewal",
    fileName: "lease-renewal.pdf",
    url: "/forms/lease-renewal.pdf",
  },
];

const ViewFormTemplates = ({ handleUpload }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      paddingY={1}
      data-tour="esign-3"
    >
      {DefaultFormTemplates.map((form) => (
        <Button
          key={form.id}
          variant="outlined"
          onClick={async () => {
            const readableFile = await getPreprocessedFile(
              form.url,
              form.fileName,
            );
            handleUpload({
              target: {
                files: [readableFile],
              },
            });
          }}
        >
          {form.name}
        </Button>
      ))}
    </Stack>
  );
};

export default ViewFormTemplates;
